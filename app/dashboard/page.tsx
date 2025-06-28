"use client";

import { useAuth } from "@/contexts/AuthContext";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  Users,
  Calendar,
  TrendingUp,
  Activity,
  Target,
  BookOpen,
  Building,
  UserCheck,
} from "lucide-react";

// Mock data - in a real app, this would come from Firestore
const mockData = {
  admin: {
    stats: [
      { label: "Total Users", value: "247", icon: Users, change: "+12%" },
      { label: "Active Programs", value: "15", icon: BookOpen, change: "+5%" },
      {
        label: "Sessions This Week",
        value: "42",
        icon: Calendar,
        change: "+8%",
      },
      { label: "Facilities", value: "8", icon: Building, change: "+2%" },
    ],
    recentActivity: [
      "New participant John Smith joined",
      'Program "Strength Building" completed',
      "Instructor Sarah assigned to new facility",
      "Weekly progress reports generated",
    ],
  },
  participant: {
    stats: [
      { label: "Programs Joined", value: "3", icon: BookOpen, change: "+1" },
      {
        label: "Sessions Completed",
        value: "24",
        icon: Calendar,
        change: "+3",
      },
      {
        label: "Progress Score",
        value: "78%",
        icon: TrendingUp,
        change: "+5%",
      },
      { label: "Goals Achieved", value: "5", icon: Target, change: "+2" },
    ],
    recentActivity: [
      "Completed strength training session",
      "New goal: Improve coordination",
      "Progress update from instructor",
      "Next session scheduled for tomorrow",
    ],
  },
  instructor: {
    stats: [
      { label: "Active Participants", value: "18", icon: Users, change: "+3" },
      {
        label: "Sessions This Week",
        value: "12",
        icon: Calendar,
        change: "+2",
      },
      { label: "Programs Teaching", value: "4", icon: BookOpen, change: "+1" },
      {
        label: "Avg Progress Rate",
        value: "85%",
        icon: TrendingUp,
        change: "+7%",
      },
    ],
    recentActivity: [
      "Updated progress for Maria Garcia",
      "New participant assigned: Alex Chen",
      "Session feedback submitted",
      "Weekly planning meeting scheduled",
    ],
  },
  fitness_partner: {
    stats: [
      { label: "Facilities Managed", value: "3", icon: Building, change: "+0" },
      {
        label: "Active Instructors",
        value: "7",
        icon: UserCheck,
        change: "+1",
      },
      {
        label: "Monthly Sessions",
        value: "156",
        icon: Calendar,
        change: "+12",
      },
      {
        label: "Capacity Utilization",
        value: "78%",
        icon: Activity,
        change: "+5%",
      },
    ],
    recentActivity: [
      "New instructor onboarded",
      "Equipment maintenance completed",
      "Facility capacity updated",
      "Monthly report submitted",
    ],
  },
  service_provider: {
    stats: [
      { label: "Active Clients", value: "32", icon: Users, change: "+4" },
      { label: "Support Workers", value: "12", icon: UserCheck, change: "+1" },
      { label: "Care Plans", value: "28", icon: BookOpen, change: "+3" },
      { label: "This Month Goals", value: "89%", icon: Target, change: "+6%" },
    ],
    recentActivity: [
      "Care plan updated for client",
      "New support worker assigned",
      "Monthly review completed",
      "Goal achievement celebrated",
    ],
  },
  support_worker: {
    stats: [
      { label: "Assigned Clients", value: "8", icon: Users, change: "+1" },
      {
        label: "Sessions This Week",
        value: "16",
        icon: Calendar,
        change: "+2",
      },
      { label: "Support Hours", value: "42", icon: Activity, change: "+8" },
      {
        label: "Client Satisfaction",
        value: "94%",
        icon: TrendingUp,
        change: "+2%",
      },
    ],
    recentActivity: [
      "Session support provided to Tom",
      "Progress notes updated",
      "Weekly check-in completed",
      "Training session attended",
    ],
  },
};

export default function DashboardPage() {
  const { userProfile } = useAuth();

  if (!userProfile) return null;

  const data = mockData[userProfile.role] || mockData.participant;
  const roleName = userProfile.role
    .replace("_", " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Welcome back, {userProfile.displayName || "User"}!
        </h1>
        <p className="text-white/70 text-lg">
          {roleName} Dashboard - Here's what's happening today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <GlassCard key={index} className="p-6" hover>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white/70 text-sm font-medium">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-white mt-2">
                    {stat.value}
                  </p>
                  <p className="text-green-400 text-sm mt-1">{stat.change}</p>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                  <Icon className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold text-white mb-6">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {data.recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg"
                >
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <p className="text-white/80">{activity}</p>
                  <span className="text-white/50 text-sm ml-auto">
                    {Math.floor(Math.random() * 24)} hours ago
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Quick Actions */}
        <div>
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold text-white mb-6">
              Quick Actions
            </h3>
            <div className="space-y-3">
              {getQuickActions(userProfile.role).map((action, index) => (
                <button
                  key={index}
                  className="w-full text-left p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <action.icon className="w-5 h-5 text-blue-400" />
                    <span className="text-white/80">{action.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Progress Chart Placeholder */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-semibold text-white mb-6">
          Progress Overview
        </h3>
        <div className="h-64 bg-white/5 rounded-lg flex items-center justify-center">
          <p className="text-white/50">Chart visualization would go here</p>
        </div>
      </GlassCard>
    </div>
  );
}

function getQuickActions(role: string) {
  const actions = {
    admin: [
      { label: "Add New User", icon: Users },
      { label: "Create Program", icon: BookOpen },
      { label: "View Analytics", icon: TrendingUp },
      { label: "System Settings", icon: UserCheck },
    ],
    participant: [
      { label: "View My Programs", icon: BookOpen },
      { label: "Check Schedule", icon: Calendar },
      { label: "Update Goals", icon: Target },
      { label: "View Progress", icon: TrendingUp },
    ],
    instructor: [
      { label: "Plan Session", icon: Calendar },
      { label: "Update Progress", icon: TrendingUp },
      { label: "View Participants", icon: Users },
      { label: "Submit Report", icon: BookOpen },
    ],
    fitness_partner: [
      { label: "Manage Facilities", icon: Building },
      { label: "Add Instructor", icon: UserCheck },
      { label: "View Bookings", icon: Calendar },
      { label: "Update Resources", icon: Activity },
    ],
    service_provider: [
      { label: "Manage Clients", icon: Users },
      { label: "Review Care Plans", icon: BookOpen },
      { label: "Assign Staff", icon: UserCheck },
      { label: "Generate Reports", icon: TrendingUp },
    ],
    support_worker: [
      { label: "View My Clients", icon: Users },
      { label: "Update Notes", icon: BookOpen },
      { label: "Schedule Support", icon: Calendar },
      { label: "Track Progress", icon: TrendingUp },
    ],
  };

  return actions[role as keyof typeof actions] || actions.participant;
}
