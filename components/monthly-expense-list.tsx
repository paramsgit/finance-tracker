"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Calendar, DollarSign, Tag, ChevronDown, ChevronRight, Clock } from "lucide-react"
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

  const getCategoryColor = (category: string) => {
    const colors = {
      Food: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
      Transport: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      Shopping: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      Entertainment: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
      Bills: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      Healthcare: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      Education: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
      Other: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
    }
    return colors[category as keyof typeof colors] || colors.Other
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
      <Card className="dark:bg-gray-800 dark:border-gray-700 shadow-lg">
        <CardContent className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No expenses this month</h3>
          <p className="text-gray-500 dark:text-gray-400">Add your first expense to get started!</p>
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
          <Card key={date} className="dark:bg-gray-800 dark:border-gray-700 shadow-lg overflow-hidden">
            {/* Date Header - Clickable */}
            <CardHeader
              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 pb-3"
              onClick={() => toggleDateCollapse(date)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    {isCollapsed ? (
                      <ChevronRight className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      {formatDate(date)}
                    </CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {dateExpenses.length} expense{dateExpenses.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-1">
                    <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                    {dateAmount.toFixed(2)}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Click to {isCollapsed ? "expand" : "collapse"}
                  </p>
                </div>
              </div>
            </CardHeader>

            {/* Expenses List - Collapsible */}
            {!isCollapsed && (
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {dateExpenses
                    .sort((a, b) => b.amount - a.amount) // Sort by amount within each date
                    .map((expense) => (
                      <div
                        key={expense.id}
                        className="group p-4 border-2 border-gray-100 dark:border-gray-700 rounded-xl hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md transition-all duration-200 bg-white dark:bg-gray-800/50"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                              <div className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                                {expense.amount.toFixed(2)}
                              </div>
                              <div
                                className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${getCategoryColor(expense.category)}`}
                              >
                                <Tag className="h-3 w-3" />
                                {expense.category}
                              </div>
                            </div>
                            {expense.note && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
                                {expense.note}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onEdit(expense)}
                              className="dark:border-gray-600 dark:hover:bg-gray-700 hover:border-blue-300 hover:text-blue-600 dark:hover:text-blue-400"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onDelete(expense.id)}
                              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 dark:border-gray-600 dark:hover:bg-gray-700 hover:border-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            )}
          </Card>
        )
      })}
    </div>
  )
}
