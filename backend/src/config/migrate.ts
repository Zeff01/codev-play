import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "./db";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// migrate.ts is in src/config, migrations is in backend/migrations
const MIGRATIONS_DIR = path.join(__dirname, "..", "..", "migrations");

async function runMigrations() {
  const client = await pool.connect();

  try {
    // ✅ 1) Ensure the migrations table exists (bootstrap)
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename TEXT UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // ✅ 2) Read executed migrations (only filename column needed)
    const { rows } = await client.query<{ filename: string }>(
      "SELECT filename FROM migrations"
    );
    const executed = new Set(rows.map((r) => r.filename));

    const files = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    for (const file of files) {
      if (executed.has(file)) continue;

      console.log(`Running migration: ${file}`);

      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), "utf8");

      // ✅ 3) Run each migration in its own transaction
      // This prevents one bad migration from rolling back ALL previous ones in the same run.
      await client.query("BEGIN");
      try {
        await client.query(sql);
        await client.query("INSERT INTO migrations (filename) VALUES ($1)", [
          file,
        ]);
        await client.query("COMMIT");
      } catch (e) {
        await client.query("ROLLBACK");
        throw e;
      }
    }

    console.log("✅ All migrations applied");
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration failed", err);
    process.exit(1);
  } finally {
    client.release();
  }
}

runMigrations();
