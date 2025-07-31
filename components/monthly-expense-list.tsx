"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getCategoryIcon, getCategoryColor } from "@/utils/category-icons"
import { Edit, Trash2, Calendar, DollarSign, ChevronDown, ChevronRight, Clock } from "lucide-react"
import type { Expense } from "@/types"

interface MonthlyExpenseListProps {
  expenses: Expense[]
  onEdit: (expense: Expense) => void
  onDelete: (id: string) => void
}

export function MonthlyExpenseList({ expenses, onEdit, onDelete }: MonthlyExpenseListProps) {
  const [collapsedDates, setCollapsedDates] = useState<Set<string>>(new Set())

  // Group expenses by date
  const expensesByDate = expenses.reduce(
    (acc, expense) => {
      const date = expense.date
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(expense)
      return acc
    },
    {} as Record<string, Expense[]>,
  )

  // Sort dates in descending order (newest first)
  const sortedDates = Object.keys(expensesByDate).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  const toggleDateCollapse = (date: string) => {
    const newCollapsed = new Set(collapsedDates)
    if (newCollapsed.has(date)) {
      newCollapsed.delete(date)
    } else {
      newCollapsed.add(date)
    }
    setCollapsedDates(newCollapsed)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      })
    }
  }

  const getDateAmount = (date: string) => {
    return expensesByDate[date].reduce((sum, expense) => sum + expense.amount, 0)
  }

  if (expenses.length === 0) {
    return (
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <CardContent className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="h-10 w-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No expenses this month</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Add your first expense to get started tracking your spending!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {sortedDates.map((date) => {
        const dateExpenses = expensesByDate[date]
        const isCollapsed = collapsedDates.has(date)
        const dateAmount = getDateAmount(date)

        return (
          <Card
            key={date}
            className="border-0 shadow-xl overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900"
          >
            {/* Date Header - Clickable */}
            <CardHeader
              className="cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-200 pb-4"
              onClick={() => toggleDateCollapse(date)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="p-2 md:p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                    {isCollapsed ? (
                      <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-white" />
                    ) : (
                      <ChevronDown className="h-4 w-4 md:h-5 md:w-5 text-white" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg md:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Clock className="h-4 w-4 md:h-5 md:w-5 text-gray-500 dark:text-gray-400" />
                      {formatDate(date)}
                    </CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-2">
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs font-medium">
                        {dateExpenses.length} expense{dateExpenses.length !== 1 ? "s" : ""}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-1">
                    <DollarSign className="h-5 w-5 md:h-6 md:w-6 text-green-600 dark:text-green-400" />
                    {dateAmount.toFixed(2)}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 hidden md:block">
                    Click to {isCollapsed ? "expand" : "collapse"}
                  </p>
                </div>
              </div>
            </CardHeader>

            {/* Expenses List - Collapsible */}
            {!isCollapsed && (
              <CardContent className="pt-0 pb-6">
                <div className="space-y-3">
                  {dateExpenses
                    .sort((a, b) => b.amount - a.amount) // Sort by amount within each date
                    .map((expense) => {
                      const CategoryIcon = getCategoryIcon(expense.category)
                      const colors = getCategoryColor(expense.category)

                      return (
                        <div
                          key={expense.id}
                          className="group p-3 md:p-4 border-2 border-gray-100 dark:border-gray-700 rounded-xl hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-lg transition-all duration-200 bg-white dark:bg-gray-800/50"
                        >
                          <div className="flex items-center justify-between gap-3 md:gap-4">
                            <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                              {/* Category Icon */}
                              <div className={`p-2 md:p-3 rounded-xl ${colors.bg} ${colors.border} border shadow-sm`}>
                                <CategoryIcon className={`h-4 w-4 md:h-5 md:w-5 ${colors.icon}`} />
                              </div>

                              {/* Expense Details */}
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mb-2">
                                  <div className="text-lg md:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-1">
                                    <DollarSign className="h-4 w-4 md:h-5 md:w-5 text-green-600 dark:text-green-400" />
                                    {expense.amount.toFixed(2)}
                                  </div>
                                  <div
                                    className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium ${colors.bg} ${colors.text} ${colors.border} border w-fit`}
                                  >
                                    {expense.category}
                                  </div>
                                </div>
                                {expense.note && (
                                  <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-2 md:p-3 rounded-lg">
                                    {expense.note}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col md:flex-row gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onEdit(expense)}
                                className="dark:border-gray-600 dark:hover:bg-gray-700 hover:border-blue-300 hover:text-blue-600 dark:hover:text-blue-400 shadow-sm text-xs md:text-sm"
                              >
                                <Edit className="h-3 w-3 md:h-4 md:w-4 md:mr-1" />
                                <span className="hidden md:inline">Edit</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onDelete(expense.id)}
                                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 dark:border-gray-600 dark:hover:bg-gray-700 hover:border-red-300 shadow-sm text-xs md:text-sm"
                              >
                                <Trash2 className="h-3 w-3 md:h-4 md:w-4 md:mr-1" />
                                <span className="hidden md:inline">Delete</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            )}
          </Card>
        )
      })}
    </div>
  )
}
