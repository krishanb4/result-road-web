"use client";

import { useAuth } from "@/contexts/AuthContext";
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
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 transition-colors duration-300">
          My Progress
        </h1>
        <p className="text-slate-600 dark:text-slate-300 transition-colors duration-300">
          Track your journey and celebrate achievements
        </p>
      </div>

      {/* Progress Metrics */}
      <div className="grid md:grid-cols-3 gap-6">
        {Object.entries(data.metrics).map(([key, metric]) => (
          <div
            key={key}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white capitalize transition-colors duration-300">
                {key}
              </h3>
              <TrendingUp
                className={`w-5 h-5 transition-colors duration-300 ${
                  metric.trend === "up"
                    ? "text-emerald-500 dark:text-emerald-400"
                    : "text-red-500 dark:text-red-400"
                }`}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-end space-x-2">
                <span className="text-3xl font-bold text-slate-900 dark:text-white transition-colors duration-300">
                  {metric.current}%
                </span>
                <span className="text-emerald-500 dark:text-emerald-400 text-sm font-medium transition-colors duration-300">
                  {metric.change}
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 transition-colors duration-300">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-blue-600 dark:from-emerald-400 dark:to-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${metric.current}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Current Goals */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 p-6 rounded-xl shadow-sm transition-all duration-300">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center transition-colors duration-300">
          <Target className="w-6 h-6 mr-2 text-emerald-600 dark:text-emerald-400 transition-colors duration-300" />
          Current Goals
        </h3>
        <div className="space-y-4">
          {data.currentGoals.map((goal) => (
            <div
              key={goal.id}
              className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 transition-colors duration-300"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-slate-900 dark:text-white font-medium transition-colors duration-300">
                    {goal.title}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm transition-colors duration-300">
                    {goal.target}
                  </p>
                </div>
                <span className="text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">
                  Due: {goal.deadline}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400 text-sm transition-colors duration-300">
                    Progress
                  </span>
                  <span className="text-slate-900 dark:text-white font-medium transition-colors duration-300">
                    {goal.progress}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 transition-colors duration-300">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-blue-500 dark:from-emerald-400 dark:to-blue-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Sessions & Achievements */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Sessions */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 p-6 rounded-xl shadow-sm transition-all duration-300">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center transition-colors duration-300">
            <Activity className="w-6 h-6 mr-2 text-emerald-600 dark:text-emerald-400 transition-colors duration-300" />
            Recent Sessions
          </h3>
          <div className="space-y-4">
            {data.recentSessions.map((session, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg transition-colors duration-300"
              >
                <div>
                  <div className="text-slate-900 dark:text-white font-medium transition-colors duration-300">
                    {session.program}
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 text-sm transition-colors duration-300">
                    {session.instructor} • {session.date}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-slate-900 dark:text-white transition-colors duration-300">
                    {session.score}/10
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 text-sm transition-colors duration-300">
                    Score
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 p-6 rounded-xl shadow-sm transition-all duration-300">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center transition-colors duration-300">
            <Award className="w-6 h-6 mr-2 text-emerald-600 dark:text-emerald-400 transition-colors duration-300" />
            Recent Achievements
          </h3>
          <div className="space-y-4">
            {data.achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg transition-colors duration-300"
                >
                  <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-lg transition-colors duration-300">
                    <Icon className="w-6 h-6 text-amber-600 dark:text-amber-400 transition-colors duration-300" />
                  </div>
                  <div>
                    <div className="text-slate-900 dark:text-white font-medium transition-colors duration-300">
                      {achievement.title}
                    </div>
                    <div className="text-slate-600 dark:text-slate-400 text-sm transition-colors duration-300">
                      {achievement.date}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
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
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 transition-colors duration-300">
          Student Progress Overview
        </h1>
        <p className="text-slate-600 dark:text-slate-300 transition-colors duration-300">
          Monitor and track your students' development
        </p>
      </div>

      {/* Program Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2 transition-colors duration-300">
              {data.programStats.completionRate}%
            </div>
            <div className="text-slate-600 dark:text-slate-400 transition-colors duration-300">
              Completion Rate
            </div>
          </div>
        </div>
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2 transition-colors duration-300">
              {data.programStats.sessionsSinceLastWeek}
            </div>
            <div className="text-slate-600 dark:text-slate-400 transition-colors duration-300">
              Sessions This Week
            </div>
          </div>
        </div>
      </div>

      {/* Student Progress */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 p-6 rounded-xl shadow-sm transition-all duration-300">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 transition-colors duration-300">
          Student Progress
        </h3>
        <div className="space-y-4">
          {data.studentProgress.map((student, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg transition-colors duration-300"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-slate-200 dark:bg-slate-600 rounded-full flex items-center justify-center transition-colors duration-300">
                  <span className="text-slate-900 dark:text-white font-medium transition-colors duration-300">
                    {student.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <div className="text-slate-900 dark:text-white font-medium transition-colors duration-300">
                    {student.name}
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 text-sm transition-colors duration-300">
                    {student.program}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-slate-900 dark:text-white font-medium transition-colors duration-300">
                    {student.progress}% Complete
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 text-sm transition-colors duration-300">
                    Last: {student.lastSession}
                  </div>
                </div>
                <div className="w-20">
                  <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 transition-colors duration-300">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-blue-500 dark:from-emerald-400 dark:to-blue-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${student.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
