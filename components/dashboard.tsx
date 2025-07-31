"use client"

import { useState } from "react"
import { useExpenses } from "@/hooks/use-expenses"
import { useBudget } from "@/hooks/use-budget"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { MonthSelector } from "@/components/month-selector"
import { SpendingChart } from "@/components/spending-chart"
import { DailySpendingChart } from "@/components/daily-spending-chart"
import { RecentExpenses } from "@/components/recent-expenses"
import { CategoryBreakdown } from "@/components/category-breakdown"
import { TrendingDown, Wallet, Target, AlertTriangle, CheckCircle, Activity } from "lucide-react"

export function Dashboard() {
  const { expenses } = useExpenses()
  const { getMonthlyBudget } = useBudget()

  const currentDate = new Date()
  const currentMonthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth()).padStart(2, "0")}`
  const [selectedMonth, setSelectedMonth] = useState(currentMonthKey)

  const [year, monthIndex] = selectedMonth.split("-").map(Number)

  const monthExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date)
    return expenseDate.getMonth() === monthIndex && expenseDate.getFullYear() === year
  })

  const monthlyBudget = getMonthlyBudget(selectedMonth)
  const totalBudget = Object.values(monthlyBudget).reduce((sum, amount) => sum + amount, 0)
  const totalSpent = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const remaining = totalBudget - totalSpent
  const spentPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0
  const isOverBudget = totalSpent > totalBudget && totalBudget > 0

  // Calculate average daily spending
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const currentDay = selectedMonth === currentMonthKey ? currentDate.getDate() : daysInMonth
  const avgDailySpending = currentDay > 0 ? totalSpent / currentDay : 0

  const stats = [
    {
      title: "Monthly Budget",
      value: `$${totalBudget.toFixed(2)}`,
      icon: Wallet,
      color: "text-blue-600 dark:text-blue-400",
      bgGradient: "from-blue-500 to-blue-600",
      cardBg: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
      change: totalBudget > 0 ? "+100%" : "0%",
      changeColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Total Spent",
      value: `$${totalSpent.toFixed(2)}`,
      icon: TrendingDown,
      color: "text-red-600 dark:text-red-400",
      bgGradient: "from-red-500 to-red-600",
      cardBg: "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20",
      change: `${spentPercentage.toFixed(1)}%`,
      changeColor: isOverBudget ? "text-red-600 dark:text-red-400" : "text-orange-600 dark:text-orange-400",
    },
    {
      title: "Remaining",
      value: `$${Math.abs(remaining).toFixed(2)}`,
      icon: remaining >= 0 ? CheckCircle : AlertTriangle,
      color: remaining >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400",
      bgGradient: remaining >= 0 ? "from-green-500 to-green-600" : "from-red-500 to-red-600",
      cardBg:
        remaining >= 0
          ? "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20"
          : "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20",
      change: remaining >= 0 ? "On track" : "Over budget",
      changeColor: remaining >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400",
    },
    {
      title: "Daily Average",
      value: `$${avgDailySpending.toFixed(2)}`,
      icon: Activity,
      color: "text-purple-600 dark:text-purple-400",
      bgGradient: "from-purple-500 to-purple-600",
      cardBg: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20",
      change: `${monthExpenses.length} expenses`,
      changeColor: "text-purple-600 dark:text-purple-400",
    },
  ]

  const selectedMonthLabel = new Date(year, monthIndex).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Financial Dashboard</h1>
              <p className="text-blue-100 text-lg">
                Your complete overview for <span className="font-semibold">{selectedMonthLabel}</span>
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-1">
              <MonthSelector selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />
            </div>
          </div>
        </div>
        <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/5 rounded-full" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/5 rounded-full" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={stat.title}
            className={`border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 ${stat.cardBg} overflow-hidden group`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">{stat.title}</CardTitle>
              <div
                className={`p-3 rounded-xl bg-gradient-to-br ${stat.bgGradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl md:text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
              <p className={`text-xs font-medium ${stat.changeColor} flex items-center gap-1`}>
                <Target className="h-3 w-3" />
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Budget Progress */}
      {totalBudget > 0 && (
        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <Target className="h-6 w-6 text-white" />
              </div>
              Budget Progress
              {isOverBudget && <AlertTriangle className="h-5 w-5 text-red-500 animate-pulse" />}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-gray-600 dark:text-gray-400">
                Spent: <span className="text-gray-900 dark:text-white">${totalSpent.toFixed(2)}</span>
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                Budget: <span className="text-gray-900 dark:text-white">${totalBudget.toFixed(2)}</span>
              </span>
            </div>
            <div className="relative">
              <Progress value={Math.min(spentPercentage, 100)} className="h-4 bg-gray-200 dark:bg-gray-700" />
              {spentPercentage > 100 && (
                <div
                  className="absolute top-0 left-0 h-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full animate-pulse"
                  style={{ width: "100%" }}
                />
              )}
            </div>
            <div className="text-center">
              {isOverBudget ? (
                <div className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400 font-semibold">
                  <AlertTriangle className="h-4 w-4" />
                  Over budget by ${(totalSpent - totalBudget).toFixed(2)} ({(spentPercentage - 100).toFixed(1)}%)
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                  <span className="text-green-600 dark:text-green-400 font-semibold">
                    {(100 - spentPercentage).toFixed(1)}%
                  </span>{" "}
                  of budget remaining
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <SpendingChart expenses={monthExpenses} />
          <DailySpendingChart expenses={monthExpenses} />
        </div>
        <div className="space-y-6">
          <CategoryBreakdown expenses={monthExpenses} />
          <RecentExpenses expenses={monthExpenses.slice(0, 5)} />
        </div>
      </div>
    </div>
  )
}
