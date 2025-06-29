"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  BookOpen,
  Clock,
  Users,
  Target,
  Plus,
  Filter,
  Search,
} from "lucide-react";

// Mock programs data
const mockPrograms = [
  {
    id: "1",
    name: "Strength Building Fundamentals",
    description:
      "Build foundational strength through progressive resistance training tailored for all ability levels.",
    duration: 10,
    difficulty: "easy",
    instructor: "Sarah Johnson",
    participants: 12,
    nextSession: "2024-06-29",
    objectives: [
      "Improve upper body strength",
      "Build core stability",
      "Enhance functional movement",
    ],
    enrolled: false,
  },
  {
    id: "2",
    name: "Balance & Coordination Training",
    description:
      "Improve balance, coordination, and proprioception through targeted exercises and activities.",
    duration: 8,
    difficulty: "moderate",
    instructor: "Mike Wilson",
    participants: 8,
    nextSession: "2024-06-30",
    objectives: [
      "Enhance balance control",
      "Improve coordination",
      "Reduce fall risk",
    ],
    enrolled: true,
  },
  {
    id: "3",
    name: "Confidence Through Movement",
    description:
      "Build self-confidence and social skills through group fitness activities and challenges.",
    duration: 12,
    difficulty: "easy",
    instructor: "Lisa Chen",
    participants: 15,
    nextSession: "2024-07-01",
    objectives: [
      "Build self-confidence",
      "Improve social interaction",
      "Develop leadership skills",
    ],
    enrolled: true,
  },
  {
    id: "4",
    name: "Advanced Fitness Challenge",
    description:
      "High-intensity program for experienced participants ready to push their limits.",
    duration: 6,
    difficulty: "challenging",
    instructor: "David Brown",
    participants: 6,
    nextSession: "2024-07-02",
    objectives: [
      "Maximize physical potential",
      "Advanced skill development",
      "Competition preparation",
    ],
    enrolled: false,
  },
];

const difficultyColors = {
  easy: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700",
  moderate:
    "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700",
  challenging:
    "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700",
};

export default function ProgramsPage() {
  const { userProfile } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [showEnrolledOnly, setShowEnrolledOnly] = useState(false);

  if (!userProfile) return null;

  const filteredPrograms = mockPrograms.filter((program) => {
    const matchesSearch =
      program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty =
      selectedDifficulty === "all" || program.difficulty === selectedDifficulty;
    const matchesEnrollment = !showEnrolledOnly || program.enrolled;

    return matchesSearch && matchesDifficulty && matchesEnrollment;
  });

  const isParticipant = userProfile.role === "participant";
  const canCreatePrograms = ["admin", "instructor"].includes(userProfile.role);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 transition-colors duration-300">
            {isParticipant ? "My Programs" : "Fitness Programs"}
          </h1>
          <p className="text-slate-600 dark:text-slate-300 transition-colors duration-300">
            {isParticipant
              ? "Explore available programs and track your enrollment"
              : "Manage and oversee fitness programs"}
          </p>
        </div>
        {canCreatePrograms && (
          <button className="bg-gradient-to-r from-emerald-600 to-blue-600 dark:from-emerald-500 dark:to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all flex items-center space-x-2 shadow-lg">
            <Plus className="w-5 h-5" />
            <span>Create Program</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 p-6 rounded-xl shadow-sm transition-all duration-300">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500 dark:text-slate-400 transition-colors duration-300" />
            <input
              type="text"
              placeholder="Search programs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent transition-all duration-300"
            />
          </div>

          {/* Difficulty Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500 dark:text-slate-400 transition-colors duration-300" />
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent appearance-none transition-all duration-300"
            >
              <option value="all" className="bg-white dark:bg-slate-800">
                All Difficulties
              </option>
              <option value="easy" className="bg-white dark:bg-slate-800">
                Easy
              </option>
              <option value="moderate" className="bg-white dark:bg-slate-800">
                Moderate
              </option>
              <option
                value="challenging"
                className="bg-white dark:bg-slate-800"
              >
                Challenging
              </option>
            </select>
          </div>

          {/* Enrollment Filter (for participants) */}
          {isParticipant && (
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="enrolled-only"
                checked={showEnrolledOnly}
                onChange={(e) => setShowEnrolledOnly(e.target.checked)}
                className="w-4 h-4 text-emerald-600 bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded focus:ring-emerald-500 dark:focus:ring-emerald-400 transition-colors duration-300"
              />
              <label
                htmlFor="enrolled-only"
                className="text-slate-700 dark:text-slate-300 transition-colors duration-300"
              >
                Show enrolled only
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Programs Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {filteredPrograms.map((program) => (
          <div
            key={program.id}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2 transition-colors duration-300">
                    {program.name}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors duration-300 ${
                      difficultyColors[
                        program.difficulty as keyof typeof difficultyColors
                      ]
                    }`}
                  >
                    {program.difficulty.charAt(0).toUpperCase() +
                      program.difficulty.slice(1)}
                  </span>
                </div>
                {isParticipant && program.enrolled && (
                  <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 px-3 py-1 rounded-full text-xs font-medium transition-colors duration-300">
                    Enrolled
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-slate-600 dark:text-slate-300 transition-colors duration-300">
                {program.description}
              </p>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 transition-colors duration-300">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{program.duration} weeks</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 transition-colors duration-300">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">
                    {program.participants} participants
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 transition-colors duration-300">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-sm">by {program.instructor}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 transition-colors duration-300">
                  <Target className="w-4 h-4" />
                  <span className="text-sm">Next: {program.nextSession}</span>
                </div>
              </div>

              {/* Objectives */}
              <div>
                <h4 className="text-slate-900 dark:text-white font-medium mb-2 text-sm transition-colors duration-300">
                  Program Objectives:
                </h4>
                <ul className="space-y-1">
                  {program.objectives.map((objective, index) => (
                    <li
                      key={index}
                      className="text-slate-600 dark:text-slate-400 text-sm flex items-center space-x-2 transition-colors duration-300"
                    >
                      <div className="w-1 h-1 bg-emerald-500 dark:bg-emerald-400 rounded-full transition-colors duration-300"></div>
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700 transition-colors duration-300">
                {isParticipant ? (
                  <div className="flex space-x-3">
                    {program.enrolled ? (
                      <>
                        <button className="flex-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 py-2 px-4 rounded-lg font-medium hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-all duration-300">
                          View Progress
                        </button>
                        <button className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 py-2 px-4 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-300">
                          Schedule
                        </button>
                      </>
                    ) : (
                      <button className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 dark:from-emerald-500 dark:to-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition-all duration-300 shadow-lg">
                        Enroll Now
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex space-x-3">
                    <button className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 py-2 px-4 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-300">
                      View Details
                    </button>
                    {canCreatePrograms && (
                      <button className="flex-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 py-2 px-4 rounded-lg font-medium hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-all duration-300">
                        Edit Program
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPrograms.length === 0 && (
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 p-12 text-center rounded-xl shadow-sm transition-all duration-300">
          <BookOpen className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4 transition-colors duration-300" />
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2 transition-colors duration-300">
            No Programs Found
          </h3>
          <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300">
            {searchTerm || selectedDifficulty !== "all" || showEnrolledOnly
              ? "Try adjusting your search criteria."
              : "No programs are currently available."}
          </p>
        </div>
      )}
    </div>
  );
}
