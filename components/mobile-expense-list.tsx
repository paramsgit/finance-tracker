"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { getCategoryIcon, getCategoryColor } from "@/utils/category-icons"
import { Edit, Trash2, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import type { Expense } from "@/types"

interface MobileExpenseListProps {
  expenses: Expense[]
  onEdit: (expense: Expense) => void
  onDelete: (id: string) => void
  onAddExpense: () => void
  selectedMonth: string
  onMonthChange: (direction: "prev" | "next") => void
}

export function MobileExpenseList({
  expenses,
  onEdit,
  onDelete,
  onAddExpense,
  selectedMonth,
  onMonthChange,
}: MobileExpenseListProps) {
  const [selectedExpense, setSelectedExpense] = useState<string | null>(null)

  // Parse selected month
  const [year, monthIndex] = selectedMonth.split("-").map(Number)
  const selectedMonthDate = new Date(year, monthIndex)
  const selectedMonthLabel = selectedMonthDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  // Group expenses by date and sort
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

  const sortedDates = Object.keys(expensesByDate).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0)

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
        month: "short",
        day: "numeric",
      })
    }
  }

  const handleExpenseAction = (expense: Expense, action: "edit" | "delete") => {
    if (action === "edit") {
      onEdit(expense)
    } else {
      onDelete(expense.id)
    }
    setSelectedExpense(null)
  }

  if (expenses.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6">
        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
          <Plus className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No expenses yet</h3>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-8">
          Start tracking your spending by adding your first expense
        </p>
        <Button
          onClick={onAddExpense}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium"
        >
          Add Expense
        </Button>
      </div>
    )
  }

  return (
    <div className="pb-6">
      {/* Month Header */}
      <div className="sticky top-0 bg-white dark:bg-gray-900 z-10 px-4 py-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onMonthChange("prev")}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{selectedMonthLabel}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{expenses.length} expenses</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onMonthChange("next")}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">${totalAmount.toFixed(2)}</div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total spent this month</p>
        </div>
      </div>

      {/* Expense List */}
      <div className="px-4">
        {sortedDates.map((date) => {
          const dateExpenses = expensesByDate[date]
          const dateAmount = dateExpenses.reduce((sum, expense) => sum + expense.amount, 0)

          return (
            <div key={date} className="mb-6">
              {/* Date Header */}
              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                <h3 className="font-medium text-gray-900 dark:text-white">{formatDate(date)}</h3>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">${dateAmount.toFixed(2)}</span>
              </div>

              {/* Expenses for this date */}
              <div className="space-y-1 mt-2">
                {dateExpenses
                  .sort((a, b) => b.amount - a.amount)
                  .map((expense) => {
                    const CategoryIcon = getCategoryIcon(expense.category)
                    const colors = getCategoryColor(expense.category)
                    const isSelected = selectedExpense === expense.id

                    return (
                      <div key={expense.id} className="relative">
                        <div
                          className={`flex items-center justify-between py-3 px-1 rounded-lg transition-colors ${
                            isSelected ? "bg-blue-50 dark:bg-blue-900/20" : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                          }`}
                          onClick={() => setSelectedExpense(isSelected ? null : expense.id)}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            {/* Category Icon */}
                            <div className={`p-2 rounded-lg ${colors.bg}`}>
                              <CategoryIcon className={`h-5 w-5 ${colors.icon}`} />
                            </div>

                            {/* Expense Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-white">{expense.category}</p>
                                  {expense.note && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{expense.note}</p>
                                  )}
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-gray-900 dark:text-white">
                                    -${expense.amount.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        {isSelected && (
                          <div className="flex gap-2 mt-2 px-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleExpenseAction(expense, "edit")}
                              className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/20"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleExpenseAction(expense, "delete")}
                              className="flex-1 text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        )}
                      </div>
                    )
                  })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
