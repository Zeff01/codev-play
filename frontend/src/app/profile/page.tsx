"use client";

import { useAuth } from "@/context/AuthContext";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfileAchievements from "@/components/profile/ProfileAchievements";
import { Star, Flame, Medal, Crown } from "lucide-react";

export default function ProfilePage() {
    const { user, loading } = useAuth();

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (!user) return <div className="p-8 text-center">User not found</div>;

    const stats = {
        level: 5,
        xp: 320,
        maxXp: 500,
        points: 1450,
        rank: "Gold",
        streak: 7,
    };

    const achievements = [
        { name: "First Login", icon: Star, locked: false },
        { name: "Week Streak", icon: Flame, locked: false },
        { name: "Early Bird", icon: Medal, locked: false },
        { name: "Top Player", icon: Crown, locked: true },
    ];

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            <ProfileHeader user={user} stats={stats} />
            <ProfileStats stats={stats} />
            <ProfileAchievements achievements={achievements} />
        </div>
    );
}
