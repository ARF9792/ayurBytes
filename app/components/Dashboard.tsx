'use client';

import React, { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar
} from 'recharts';
import { 
  TrendingUp, Calendar, Flame, Award, Target, Activity,
  CheckCircle, Clock, BarChart3
} from 'lucide-react';
import {
  getDietHistory,
  getWeeklyNutritionData,
  getCalorieTrend,
  getDashboardStats,
  calculateComplianceMetrics
} from '@/lib/dashboardHelpers';
import { PatientProfile } from '@/types';
import { calculateDailyCalories } from '@/lib/nutritionHelpers';

interface DashboardProps {
  patientProfile?: PatientProfile;
}

export default function Dashboard({ patientProfile }: DashboardProps) {
  const [stats, setStats] = useState(getDashboardStats());
  const [weeklyData, setWeeklyData] = useState(getWeeklyNutritionData());
  const [compliance, setCompliance] = useState(calculateComplianceMetrics());
  const [selectedTab, setSelectedTab] = useState<'overview' | 'nutrition' | 'compliance'>('overview');

  useEffect(() => {
    // Refresh data
    setStats(getDashboardStats());
    setWeeklyData(getWeeklyNutritionData());
    setCompliance(calculateComplianceMetrics());
  }, []);

  // Calculate nutrient distribution for pie chart
  const getNutrientDistribution = () => {
    if (weeklyData.length === 0) return [];
    
    const totals = weeklyData.reduce((acc, day) => ({
      protein: acc.protein + day.protein,
      carbs: acc.carbs + day.carbs,
      fats: acc.fats + day.fats
    }), { protein: 0, carbs: 0, fats: 0 });

    return [
      { name: 'Protein', value: totals.protein, color: '#3b82f6' },
      { name: 'Carbs', value: totals.carbs, color: '#f97316' },
      { name: 'Fats', value: totals.fats, color: '#eab308' }
    ];
  };

  // Get taste balance for radar chart
  const getTasteBalance = () => {
    const history = getDietHistory();
    if (history.length === 0) return [];

    const recentEntry = history[0];
    if (!recentEntry?.nutritionalSummary?.rasaBalance) return [];

    const rasa = recentEntry.nutritionalSummary.rasaBalance;
    
    return [
      { taste: 'Sweet', value: rasa.sweet, fullMark: 10 },
      { taste: 'Sour', value: rasa.sour, fullMark: 10 },
      { taste: 'Salty', value: rasa.salty, fullMark: 10 },
      { taste: 'Pungent', value: rasa.pungent, fullMark: 10 },
      { taste: 'Bitter', value: rasa.bitter, fullMark: 10 },
      { taste: 'Astringent', value: rasa.astringent, fullMark: 10 }
    ];
  };

  // Get calorie trend data
  const getCalorieTrendData = () => {
    if (!patientProfile) return [];
    const targetCalories = calculateDailyCalories(patientProfile);
    return getCalorieTrend(targetCalories);
  };

  const nutrientData = getNutrientDistribution();
  const tasteData = getTasteBalance();
  const calorieTrendData = getCalorieTrendData();

  // If no data yet
  if (stats.totalDaysTracked === 0) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-12 text-center">
        <BarChart3 className="w-20 h-20 text-blue-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-800 mb-2">No Data Yet</h3>
        <p className="text-gray-600">
          Generate your first diet plan to start tracking your nutrition journey!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">Your Nutrition Dashboard</h2>
        <p className="text-blue-100">Track your progress and stay on your Ayurvedic journey</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 bg-white rounded-2xl p-2 shadow-md">
        <button
          onClick={() => setSelectedTab('overview')}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
            selectedTab === 'overview'
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setSelectedTab('nutrition')}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
            selectedTab === 'nutrition'
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Nutrition
        </button>
        <button
          onClick={() => setSelectedTab('compliance')}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
            selectedTab === 'compliance'
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Compliance
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Calendar className="w-6 h-6" />}
          title="Days Tracked"
          value={stats.totalDaysTracked}
          color="blue"
        />
        <StatCard
          icon={<Flame className="w-6 h-6" />}
          title="Avg Daily Calories"
          value={stats.averageDailyCalories}
          suffix=" kcal"
          color="orange"
        />
        <StatCard
          icon={<Award className="w-6 h-6" />}
          title="Current Streak"
          value={stats.currentStreak}
          suffix=" days"
          color="green"
        />
        <StatCard
          icon={<Target className="w-6 h-6" />}
          title="Compliance"
          value={stats.averageCompliance}
          suffix="%"
          color="purple"
        />
      </div>

      {/* Tab Content */}
      {selectedTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Calorie Trend */}
          <ChartCard title="Weekly Calorie Intake">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="calories" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Macro Distribution */}
          <ChartCard title="Macro Distribution (7 Days)">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={nutrientData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {nutrientData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}

      {selectedTab === 'nutrition' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Six Taste Balance */}
          <ChartCard title="Six Taste Balance (Ayurvedic)">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={tasteData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="taste" stroke="#6b7280" />
                <PolarRadiusAxis stroke="#6b7280" />
                <Radar
                  name="Taste Balance"
                  dataKey="value"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Weekly Macros */}
          <ChartCard title="Weekly Macronutrient Breakdown">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Bar dataKey="protein" fill="#3b82f6" />
                <Bar dataKey="carbs" fill="#f97316" />
                <Bar dataKey="fats" fill="#eab308" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}

      {selectedTab === 'compliance' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Compliance Metrics */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Compliance Metrics</h3>
            <div className="space-y-4">
              <MetricRow
                label="Overall Compliance"
                value={`${compliance.overallCompliance}%`}
                progress={compliance.overallCompliance}
                color="green"
              />
              <MetricRow
                label="Meals Followed"
                value={`${Math.round(compliance.mealsFollowed)} / ${compliance.totalMeals}`}
                progress={(compliance.mealsFollowed / compliance.totalMeals) * 100}
                color="blue"
              />
              <MetricRow
                label="Current Streak"
                value={`${compliance.currentStreak} days`}
                progress={(compliance.currentStreak / 30) * 100}
                color="purple"
              />
              <MetricRow
                label="Longest Streak"
                value={`${compliance.longestStreak} days`}
                progress={(compliance.longestStreak / 30) * 100}
                color="orange"
              />
            </div>
          </div>

          {/* Calorie Trend vs Target */}
          {calorieTrendData.length > 0 && (
            <ChartCard title="Calorie Trend vs Target">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={calorieTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="calories" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    name="Actual"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Target"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          )}
        </div>
      )}
    </div>
  );
}

// Helper Components
interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  suffix?: string;
  color: 'blue' | 'orange' | 'green' | 'purple';
}

function StatCard({ icon, title, value, suffix = '', color }: StatCardProps) {
  const colorClasses = {
    blue: 'from-blue-400 to-blue-600',
    orange: 'from-orange-400 to-orange-600',
    green: 'from-green-400 to-green-600',
    purple: 'from-purple-400 to-purple-600'
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-white mb-3`}>
        {icon}
      </div>
      <p className="text-gray-600 text-sm mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-800">
        {value}{suffix}
      </p>
    </div>
  );
}

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
}

function ChartCard({ title, children }: ChartCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
      {children}
    </div>
  );
}

interface MetricRowProps {
  label: string;
  value: string;
  progress: number;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

function MetricRow({ label, value, progress, color }: MetricRowProps) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500'
  };

  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-gray-700 font-medium">{label}</span>
        <span className="text-gray-900 font-bold">{value}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`${colorClasses[color]} h-2 rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </div>
  );
}
