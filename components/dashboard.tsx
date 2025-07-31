"use client"

import { useState } from "react"
import { useExpenses } from "@/hooks/use-expenses"
import { useBudget } from "@/hooks/use-budget"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { MonthSelector } from "@/components/month-selector"
import { SpendingChart } from "@/components/spending-chart"
import { DailySpendingChart } from "@/components/daily-spending-chart"
import { DollarSign, TrendingDown, TrendingUp, Wallet, Sparkles } from "lucide-react"

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

  const stats = [
    {
      title: "Monthly Budget",
      value: `$${totalBudget.toFixed(2)}`,
      icon: Wallet,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Total Spent",
      value: `$${totalSpent.toFixed(2)}`,
      icon: TrendingDown,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      iconBg: "bg-red-100 dark:bg-red-900/30",
    },
    {
      title: "Remaining",
      value: `$${remaining.toFixed(2)}`,
      icon: TrendingUp,
      color: remaining >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400",
      bgColor: remaining >= 0 ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20",
      iconBg: remaining >= 0 ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30",
    },
    {
      title: "Total Expenses",
      value: monthExpenses.length.toString(),
      icon: Sparkles,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
    },
  ]

  const selectedMonthLabel = new Date(year, monthIndex).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Overview of your finances for {selectedMonthLabel}</p>
        </div>
        <MonthSelector selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className={`dark:border-gray-700 border-0 shadow-lg ${stat.bgColor} hover:shadow-xl transition-all duration-200 transform hover:scale-105`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.iconBg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-xl md:text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalBudget > 0 && (
        <Card className="dark:bg-gray-800 dark:border-gray-700 shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              Budget Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Spent: ${totalSpent.toFixed(2)}</span>
                <span className="text-gray-600 dark:text-gray-400">Budget: ${totalBudget.toFixed(2)}</span>
              </div>
              <Progress value={Math.min(spentPercentage, 100)} className="h-3" />
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                {spentPercentage > 100
                  ? `Over budget by $${(totalSpent - totalBudget).toFixed(2)}`
                  : `${(100 - spentPercentage).toFixed(1)}% remaining`}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <SpendingChart expenses={monthExpenses} />
        <DailySpendingChart expenses={monthExpenses} />
      </div>
    </div>
  )
}
