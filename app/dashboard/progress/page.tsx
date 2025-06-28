"use client";

import { useAuth } from "@/contexts/AuthContext";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  TrendingUp,
  Target,
  Calendar,
  Award,
  Activity,
  Zap,
} from "lucide-react";

// Mock progress data
const mockProgressData = {
  participant: {
    currentGoals: [
      {
        id: 1,
        title: "Improve Upper Body Strength",
        progress: 75,
        target: "Complete 3 pull-ups",
        deadline: "2024-08-15",
      },
      {
        id: 2,
        title: "Better Balance & Coordination",
        progress: 60,
        target: "Hold 30-second single-leg stand",
        deadline: "2024-07-30",
      },
      {
        id: 3,
        title: "Increase Confidence",
        progress: 85,
        target: "Lead a group warm-up session",
        deadline: "2024-07-20",
      },
    ],
    metrics: {
      strength: { current: 72, change: "+12%", trend: "up" },
      coordination: { current: 68, change: "+8%", trend: "up" },
      confidence: { current: 81, change: "+15%", trend: "up" },
    },
    recentSessions: [
      {
        date: "2024-06-26",
        program: "Strength Building",
        instructor: "Sarah Johnson",
        score: 8.5,
      },
      {
        date: "2024-06-24",
        program: "Balance & Coordination",
        instructor: "Mike Wilson",
        score: 7.8,
      },
      {
        date: "2024-06-21",
        program: "Confidence Building",
        instructor: "Sarah Johnson",
        score: 9.2,
      },
      {
        date: "2024-06-19",
        program: "Strength Building",
        instructor: "Lisa Chen",
        score: 8.0,
      },
    ],
    achievements: [
      { title: "First Month Complete", date: "2024-06-15", icon: Calendar },
      { title: "Strength Milestone", date: "2024-06-10", icon: Zap },
      { title: "Perfect Attendance Week", date: "2024-06-05", icon: Award },
    ],
  },
  instructor: {
    studentProgress: [
      {
        name: "John Smith",
        program: "Strength Building",
        progress: 75,
        lastSession: "2024-06-26",
      },
      {
        name: "Maria Garcia",
        program: "Balance Training",
        progress: 82,
        lastSession: "2024-06-25",
      },
      {
        name: "Alex Chen",
        program: "Confidence Building",
        progress: 69,
        lastSession: "2024-06-24",
      },
      {
        name: "Emma Wilson",
        program: "General Fitness",
        progress: 91,
        lastSession: "2024-06-26",
      },
    ],
    programStats: {
      totalStudents: 18,
      averageProgress: 76,
      completionRate: 89,
      sessionsSinceLastWeek: 24,
    },
  },
};

export default function ProgressPage() {
  const { userProfile } = useAuth();

  if (!userProfile) return null;

  const data =
    mockProgressData[userProfile.role as keyof typeof mockProgressData] ||
    mockProgressData.participant;

  if (userProfile.role === "participant") {
    return (
      <ParticipantProgress data={data as typeof mockProgressData.participant} />
    );
  }

  if (userProfile.role === "instructor") {
    return (
      <InstructorProgress data={data as typeof mockProgressData.instructor} />
    );
  }

  // Default participant view for other roles
  return <ParticipantProgress data={mockProgressData.participant} />;
}

function ParticipantProgress({
  data,
}: {
  data: typeof mockProgressData.participant;
}) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">My Progress</h1>
        <p className="text-white/70">
          Track your journey and celebrate achievements
        </p>
      </div>

      {/* Progress Metrics */}
      <div className="grid md:grid-cols-3 gap-6">
        {Object.entries(data.metrics).map(([key, metric]) => (
          <GlassCard key={key} className="p-6" hover>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white capitalize">
                {key}
              </h3>
              <TrendingUp
                className={`w-5 h-5 ${
                  metric.trend === "up" ? "text-green-400" : "text-red-400"
                }`}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-end space-x-2">
                <span className="text-3xl font-bold text-white">
                  {metric.current}%
                </span>
                <span className="text-green-400 text-sm font-medium">
                  {metric.change}
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${metric.current}%` }}
                ></div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Current Goals */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Target className="w-6 h-6 mr-2 text-blue-400" />
          Current Goals
        </h3>
        <div className="space-y-4">
          {data.currentGoals.map((goal) => (
            <div key={goal.id} className="bg-white/5 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-white font-medium">{goal.title}</h4>
                  <p className="text-white/60 text-sm">{goal.target}</p>
                </div>
                <span className="text-sm text-white/60">
                  Due: {goal.deadline}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/70 text-sm">Progress</span>
                  <span className="text-white font-medium">
                    {goal.progress}%
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Recent Sessions & Achievements */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Sessions */}
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Activity className="w-6 h-6 mr-2 text-blue-400" />
            Recent Sessions
          </h3>
          <div className="space-y-4">
            {data.recentSessions.map((session, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
              >
                <div>
                  <div className="text-white font-medium">
                    {session.program}
                  </div>
                  <div className="text-white/60 text-sm">
                    {session.instructor} • {session.date}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-white">
                    {session.score}/10
                  </div>
                  <div className="text-white/60 text-sm">Score</div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Achievements */}
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Award className="w-6 h-6 mr-2 text-blue-400" />
            Recent Achievements
          </h3>
          <div className="space-y-4">
            {data.achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg"
                >
                  <div className="bg-yellow-500/20 p-3 rounded-lg">
                    <Icon className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <div className="text-white font-medium">
                      {achievement.title}
                    </div>
                    <div className="text-white/60 text-sm">
                      {achievement.date}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function InstructorProgress({
  data,
}: {
  data: typeof mockProgressData.instructor;
}) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Student Progress Overview
        </h1>
        <p className="text-white/70">
          Monitor and track your students' development
        </p>
      </div>

      {/* Program Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <GlassCard className="p-6" hover>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">
              {data.programStats.totalStudents}
            </div>
            <div className="text-white/70">Total Students</div>
          </div>
        </GlassCard>
        <GlassCard className="p-6" hover>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">
              {data.programStats.averageProgress}%
            </div>
            <div className="text-white/70">Average Progress</div>
          </div>
        </GlassCard>
        <GlassCard className="p-6" hover>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">
              {data.programStats.completionRate}%
            </div>
            <div className="text-white/70">Completion Rate</div>
          </div>
        </GlassCard>
        <GlassCard className="p-6" hover>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">
              {data.programStats.sessionsSinceLastWeek}
            </div>
            <div className="text-white/70">Sessions This Week</div>
          </div>
        </GlassCard>
      </div>

      {/* Student Progress */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-semibold text-white mb-6">
          Student Progress
        </h3>
        <div className="space-y-4">
          {data.studentProgress.map((student, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {student.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <div className="text-white font-medium">{student.name}</div>
                  <div className="text-white/60 text-sm">{student.program}</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-white font-medium">
                    {student.progress}% Complete
                  </div>
                  <div className="text-white/60 text-sm">
                    Last: {student.lastSession}
                  </div>
                </div>
                <div className="w-20">
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                      style={{ width: `${student.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
