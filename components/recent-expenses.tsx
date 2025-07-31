"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCategoryIcon, getCategoryColor } from "@/utils/category-icons"
import { Clock, DollarSign } from "lucide-react"
import type { Expense } from "@/types"

interface RecentExpensesProps {
  expenses: Expense[]
}

export function RecentExpenses({ expenses }: RecentExpensesProps) {
  const recentExpenses = expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)

  if (expenses.length === 0) {
    return (
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg shadow-lg">
              <Clock className="h-5 w-5 text-white" />
            </div>
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No recent expenses</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg shadow-lg">
            <Clock className="h-5 w-5 text-white" />
          </div>
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentExpenses.map((expense) => {
          const CategoryIcon = getCategoryIcon(expense.category)
          const colors = getCategoryColor(expense.category)
          const date = new Date(expense.date)
          const isToday = date.toDateString() === new Date().toDateString()
          const isYesterday = date.toDateString() === new Date(Date.now() - 86400000).toDateString()

          let dateLabel = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
          if (isToday) dateLabel = "Today"
          else if (isYesterday) dateLabel = "Yesterday"

          return (
            <div
              key={expense.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-200"
            >
              <div className={`p-2 rounded-lg ${colors.bg} ${colors.border} border`}>
                <CategoryIcon className={`h-4 w-4 ${colors.icon}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900 dark:text-white truncate">{expense.category}</p>
                  <div className="flex items-center gap-1 text-gray-900 dark:text-white font-semibold">
                    <DollarSign className="h-3 w-3" />
                    {expense.amount.toFixed(2)}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {expense.note || "No description"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{dateLabel}</p>
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
