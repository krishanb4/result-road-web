"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { GlassCard } from "@/components/ui/GlassCard";
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
  easy: "bg-green-500/20 text-green-200 border-green-500/30",
  moderate: "bg-yellow-500/20 text-yellow-200 border-yellow-500/30",
  challenging: "bg-red-500/20 text-red-200 border-red-500/30",
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
          <h1 className="text-3xl font-bold text-white mb-2">
            {isParticipant ? "My Programs" : "Fitness Programs"}
          </h1>
          <p className="text-white/70">
            {isParticipant
              ? "Explore available programs and track your enrollment"
              : "Manage and oversee fitness programs"}
          </p>
        </div>
        {canCreatePrograms && (
          <button className="bg-gradient-primary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Create Program</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <GlassCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="text"
              placeholder="Search programs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>

          {/* Difficulty Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent appearance-none"
            >
              <option value="all" className="bg-gray-800">
                All Difficulties
              </option>
              <option value="easy" className="bg-gray-800">
                Easy
              </option>
              <option value="moderate" className="bg-gray-800">
                Moderate
              </option>
              <option value="challenging" className="bg-gray-800">
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
                className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
              />
              <label htmlFor="enrolled-only" className="text-white/80">
                Show enrolled only
              </label>
            </div>
          )}
        </div>
      </GlassCard>

      {/* Programs Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {filteredPrograms.map((program) => (
          <GlassCard key={program.id} className="p-6" hover>
            <div className="space-y-4">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {program.name}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${
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
                  <span className="bg-blue-500/20 text-blue-200 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-medium">
                    Enrolled
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-white/70">{program.description}</p>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 text-white/60">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{program.duration} weeks</span>
                </div>
                <div className="flex items-center space-x-2 text-white/60">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">
                    {program.participants} participants
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-white/60">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-sm">by {program.instructor}</span>
                </div>
                <div className="flex items-center space-x-2 text-white/60">
                  <Target className="w-4 h-4" />
                  <span className="text-sm">Next: {program.nextSession}</span>
                </div>
              </div>

              {/* Objectives */}
              <div>
                <h4 className="text-white font-medium mb-2 text-sm">
                  Program Objectives:
                </h4>
                <ul className="space-y-1">
                  {program.objectives.map((objective, index) => (
                    <li
                      key={index}
                      className="text-white/60 text-sm flex items-center space-x-2"
                    >
                      <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-white/10">
                {isParticipant ? (
                  <div className="flex space-x-3">
                    {program.enrolled ? (
                      <>
                        <button className="flex-1 bg-blue-500/20 text-blue-200 py-2 px-4 rounded-lg font-medium hover:bg-blue-500/30 transition-all">
                          View Progress
                        </button>
                        <button className="flex-1 bg-white/10 text-white py-2 px-4 rounded-lg font-medium hover:bg-white/20 transition-all">
                          Schedule
                        </button>
                      </>
                    ) : (
                      <button className="w-full bg-gradient-primary text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition-all">
                        Enroll Now
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex space-x-3">
                    <button className="flex-1 bg-white/10 text-white py-2 px-4 rounded-lg font-medium hover:bg-white/20 transition-all">
                      View Details
                    </button>
                    {canCreatePrograms && (
                      <button className="flex-1 bg-blue-500/20 text-blue-200 py-2 px-4 rounded-lg font-medium hover:bg-blue-500/30 transition-all">
                        Edit Program
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {filteredPrograms.length === 0 && (
        <GlassCard className="p-12 text-center">
          <BookOpen className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No Programs Found
          </h3>
          <p className="text-white/60">
            {searchTerm || selectedDifficulty !== "all" || showEnrolledOnly
              ? "Try adjusting your search criteria."
              : "No programs are currently available."}
          </p>
        </GlassCard>
      )}
    </div>
  );
}
