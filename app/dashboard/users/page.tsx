"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { Search, Plus, Edit, Trash2, Filter, MoreVertical } from "lucide-react";

// Mock user data
const mockUsers = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@email.com",
    role: "participant",
    status: "active",
    joinDate: "2024-01-15",
    lastActive: "2024-06-27",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    role: "instructor",
    status: "active",
    joinDate: "2024-02-20",
    lastActive: "2024-06-28",
  },
  {
    id: "3",
    name: "Mike Wilson",
    email: "mike.wilson@email.com",
    role: "support_worker",
    status: "active",
    joinDate: "2024-03-10",
    lastActive: "2024-06-26",
  },
  {
    id: "4",
    name: "Lisa Chen",
    email: "lisa.chen@email.com",
    role: "fitness_partner",
    status: "active",
    joinDate: "2024-01-05",
    lastActive: "2024-06-28",
  },
  {
    id: "5",
    name: "David Brown",
    email: "david.b@email.com",
    role: "service_provider",
    status: "inactive",
    joinDate: "2023-12-20",
    lastActive: "2024-06-20",
  },
];

const roleColors = {
  admin: "bg-purple-500/20 text-purple-200 border-purple-500/30",
  participant: "bg-blue-500/20 text-blue-200 border-blue-500/30",
  instructor: "bg-green-500/20 text-green-200 border-green-500/30",
  support_worker: "bg-yellow-500/20 text-yellow-200 border-yellow-500/30",
  fitness_partner: "bg-orange-500/20 text-orange-200 border-orange-500/30",
  service_provider: "bg-pink-500/20 text-pink-200 border-pink-500/30",
};

export default function UsersPage() {
  const { userProfile } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);

  // Redirect if not admin
  if (userProfile?.role !== "admin") {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl text-white mb-4">Access Denied</h1>
        <p className="text-white/70">
          You don't have permission to view this page.
        </p>
      </div>
    );
  }

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const formatRole = (role: string) => {
    return role.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            User Management
          </h1>
          <p className="text-white/70">
            Manage all users in the Result Road system
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-primary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add User</span>
        </button>
      </div>

      {/* Filters */}
      <GlassCard className="p-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>

          {/* Role Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="pl-12 pr-8 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent appearance-none min-w-48"
            >
              <option value="all" className="bg-gray-800">
                All Roles
              </option>
              <option value="participant" className="bg-gray-800">
                Participant
              </option>
              <option value="instructor" className="bg-gray-800">
                Instructor
              </option>
              <option value="support_worker" className="bg-gray-800">
                Support Worker
              </option>
              <option value="fitness_partner" className="bg-gray-800">
                Fitness Partner
              </option>
              <option value="service_provider" className="bg-gray-800">
                Service Provider
              </option>
              <option value="admin" className="bg-gray-800">
                Admin
              </option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Users Table */}
      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left p-6 text-white/80 font-semibold">
                  User
                </th>
                <th className="text-left p-6 text-white/80 font-semibold">
                  Role
                </th>
                <th className="text-left p-6 text-white/80 font-semibold">
                  Status
                </th>
                <th className="text-left p-6 text-white/80 font-semibold">
                  Join Date
                </th>
                <th className="text-left p-6 text-white/80 font-semibold">
                  Last Active
                </th>
                <th className="text-left p-6 text-white/80 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-white/10 hover:bg-white/5 transition-colors"
                >
                  <td className="p-6">
                    <div>
                      <div className="text-white font-medium">{user.name}</div>
                      <div className="text-white/60 text-sm">{user.email}</div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        roleColors[user.role as keyof typeof roleColors]
                      }`}
                    >
                      {formatRole(user.role)}
                    </span>
                  </td>
                  <td className="p-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.status === "active"
                          ? "bg-green-500/20 text-green-200 border border-green-500/30"
                          : "bg-red-500/20 text-red-200 border border-red-500/30"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="p-6 text-white/70">{user.joinDate}</td>
                  <td className="p-6 text-white/70">{user.lastActive}</td>
                  <td className="p-6">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-white/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/60">
              No users found matching your criteria.
            </p>
          </div>
        )}
      </GlassCard>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <GlassCard className="w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                Add New User
              </h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Role
                  </label>
                  <select className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent">
                    <option value="participant" className="bg-gray-800">
                      Participant
                    </option>
                    <option value="instructor" className="bg-gray-800">
                      Instructor
                    </option>
                    <option value="support_worker" className="bg-gray-800">
                      Support Worker
                    </option>
                    <option value="fitness_partner" className="bg-gray-800">
                      Fitness Partner
                    </option>
                    <option value="service_provider" className="bg-gray-800">
                      Service Provider
                    </option>
                  </select>
                </div>
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gradient-primary text-white rounded-lg font-semibold hover:opacity-90 transition-all"
                  >
                    Add User
                  </button>
                </div>
              </form>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
