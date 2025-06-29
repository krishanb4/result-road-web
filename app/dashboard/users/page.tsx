"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
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
  admin:
    "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700",
  participant:
    "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700",
  instructor:
    "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700",
  support_worker:
    "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700",
  fitness_partner:
    "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-700",
  service_provider:
    "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-700",
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
        <h1 className="text-2xl text-slate-900 dark:text-white mb-4 transition-colors duration-300">
          Access Denied
        </h1>
        <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300">
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 transition-colors duration-300">
            User Management
          </h1>
          <p className="text-slate-600 dark:text-slate-300 transition-colors duration-300">
            Manage all users in the Result Road system
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-emerald-600 to-blue-600 dark:from-emerald-500 dark:to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all flex items-center space-x-2 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Add User</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 p-6 rounded-xl shadow-sm transition-all duration-300">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500 dark:text-slate-400 transition-colors duration-300" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent transition-all duration-300"
            />
          </div>

          {/* Role Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500 dark:text-slate-400 transition-colors duration-300" />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="pl-12 pr-8 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent appearance-none min-w-48 transition-all duration-300"
            >
              <option value="all" className="bg-white dark:bg-slate-800">
                All Roles
              </option>
              <option
                value="participant"
                className="bg-white dark:bg-slate-800"
              >
                Participant
              </option>
              <option value="instructor" className="bg-white dark:bg-slate-800">
                Instructor
              </option>
              <option
                value="support_worker"
                className="bg-white dark:bg-slate-800"
              >
                Support Worker
              </option>
              <option
                value="fitness_partner"
                className="bg-white dark:bg-slate-800"
              >
                Fitness Partner
              </option>
              <option
                value="service_provider"
                className="bg-white dark:bg-slate-800"
              >
                Service Provider
              </option>
              <option value="admin" className="bg-white dark:bg-slate-800">
                Admin
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl shadow-sm overflow-hidden transition-all duration-300">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 transition-colors duration-300">
                <th className="text-left p-6 text-slate-600 dark:text-slate-400 font-semibold transition-colors duration-300">
                  Last Active
                </th>
                <th className="text-left p-6 text-slate-600 dark:text-slate-400 font-semibold transition-colors duration-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-300"
                >
                  <td className="p-6">
                    <div>
                      <div className="text-slate-900 dark:text-white font-medium transition-colors duration-300">
                        {user.name}
                      </div>
                      <div className="text-slate-600 dark:text-slate-400 text-sm transition-colors duration-300">
                        {user.email}
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors duration-300 ${
                        roleColors[user.role as keyof typeof roleColors]
                      }`}
                    >
                      {formatRole(user.role)}
                    </span>
                  </td>
                  <td className="p-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors duration-300 ${
                        user.status === "active"
                          ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700"
                          : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="p-6 text-slate-600 dark:text-slate-400 transition-colors duration-300">
                    {user.joinDate}
                  </td>
                  <td className="p-6 text-slate-600 dark:text-slate-400 transition-colors duration-300">
                    {user.lastActive}
                  </td>
                  <td className="p-6">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-all duration-300">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-all duration-300">
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
            <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300">
              No users found matching your criteria.
            </p>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl shadow-xl w-full max-w-md transition-all duration-300">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 transition-colors duration-300">
                Add New User
              </h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-2 transition-colors duration-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent transition-all duration-300"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-2 transition-colors duration-300">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent transition-all duration-300"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-2 transition-colors duration-300">
                    Role
                  </label>
                  <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent transition-all duration-300">
                    <option
                      value="participant"
                      className="bg-white dark:bg-slate-800"
                    >
                      Participant
                    </option>
                    <option
                      value="instructor"
                      className="bg-white dark:bg-slate-800"
                    >
                      Instructor
                    </option>
                    <option
                      value="support_worker"
                      className="bg-white dark:bg-slate-800"
                    >
                      Support Worker
                    </option>
                    <option
                      value="fitness_partner"
                      className="bg-white dark:bg-slate-800"
                    >
                      Fitness Partner
                    </option>
                    <option
                      value="service_provider"
                      className="bg-white dark:bg-slate-800"
                    >
                      Service Provider
                    </option>
                  </select>
                </div>
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-600 to-blue-600 dark:from-emerald-500 dark:to-blue-500 text-white rounded-lg font-semibold hover:opacity-90 transition-all duration-300 shadow-lg"
                  >
                    Add User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
