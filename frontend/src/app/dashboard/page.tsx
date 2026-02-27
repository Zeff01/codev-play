"use client";

import { motion } from "framer-motion";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { QuickPlay } from "@/components/dashboard/QuickPlay";
import { ActiveGames } from "@/components/dashboard/ActiveGames";
import { GameHistory } from "@/components/dashboard/GameHistory";
import { LeaderboardWidget } from "@/components/dashboard/LeaderboardWidget";

// 1. Dito natin ise-set yung animation settings
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Ito yung nagpapagawa ng sunod-sunod na effect (0.1 second delay per card)
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 }, // Magsisimula sila sa baba nang konti (y: 20) at invisible
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }, // Aangat papunta sa normal position
};

export default function DashboardPage() {
  return (
    // 2. Ginawa nating motion.div yung pinaka-wrapper
    <motion.div
      className="flex flex-col gap-6 p-6 md:p-10 w-full max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's your gaming overview.
        </p>
      </motion.div>

      {/* 1. Statistics Overview */}
      <motion.div variants={itemVariants}>
        <StatsOverview />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <motion.div variants={itemVariants}>
            <ActiveGames />
          </motion.div>
          <motion.div variants={itemVariants}>
            <GameHistory />
          </motion.div>
        </div>

        {/* Sidebar Area */}
        <div className="flex flex-col gap-6">
          <motion.div variants={itemVariants}>
            <QuickPlay />
          </motion.div>
          <motion.div variants={itemVariants}>
            <LeaderboardWidget />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
