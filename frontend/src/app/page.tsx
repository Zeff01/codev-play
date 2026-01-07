import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardAction } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <main className="flex p-8 justify-center mt-2">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>Create Account or Login</CardDescription>
          <CardAction>
            <Button variant="link">Sign in</Button>
            <Input id="email" type="email" placeholder="name@example.com" />
          </CardAction>
        </CardHeader>
      </Card>
    </main>
  );
}
