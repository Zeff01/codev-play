import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardAction } from "@/components/ui/card";
import { link } from "fs";

export default function Home() {
  return (
    <main className="flex p-8 justify-center mt-2">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>This is a test</CardDescription>
          <CardAction>
            <Button variant="link">Sign in</Button>
          </CardAction>
        </CardHeader>
      </Card>
    </main>
  );
}
