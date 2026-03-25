"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Check, X } from "lucide-react";

interface ProfileHeaderProps {
  user: {
    username: string;
    email: string;
    avatarUrl?: string;
  };
  stats: {
    level: number;
    xp: number;
    maxXp: number;
  };
}

export default function ProfileHeader({ user, stats }: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
  });

  const progress = (stats.xp / stats.maxXp) * 100;

  const initials =
    user.username
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-6 flex flex-col md:flex-row gap-6">
        <div className="relative w-20 h-20 shrink-0">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user?.avatarUrl ?? "https://github.com/shadcn.png"} alt={user?.username} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          {/* Online indicator */}
          <span className="absolute bottom-1 right-1 z-10 h-4 w-4 rounded-full border-2 border-background bg-green-500 dark:bg-green-800" />

          {/* Level badge */}
          <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs">LVL {stats.level}</Badge>
        </div>

        <div className="flex-1 space-y-2">
          {isEditing ? (
            <div className="space-y-2 max-w-sm">
              <Input
                value={formData.username}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    username: e.target.value,
                  })
                }
              />

              <Input
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
              />

              <div className="flex gap-2">
                <Button size="sm">
                  <Check className="w-4 h-4 mr-1" />
                  Save
                </Button>

                <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-semibold">{user.username}</h2>

                <Button size="icon" variant="ghost" onClick={() => setIsEditing(true)}>
                  <Pencil className="w-4 h-4" />
                </Button>
              </div>

              <p className="text-muted-foreground text-sm">{user.email}</p>
            </>
          )}

          <div className="pt-2 space-y-1 max-w-md">
            <div className="flex justify-between text-xs font-medium">
              <span>Progress</span>
              <span>
                {stats.xp}/{stats.maxXp} XP
              </span>
            </div>

            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
