"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getCategoryIcon, getCategoryColor } from "@/utils/category-icons"
import { PieChart } from "lucide-react"
import type { Expense } from "@/types"

interface CategoryBreakdownProps {
  expenses: Expense[]
}

export function CategoryBreakdown({ expenses }: CategoryBreakdownProps) {
  // Calculate category totals
  const categoryTotals = expenses.reduce(
    (acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    },
    {} as Record<string, number>,
  )

  const totalAmount = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0)
  const sortedCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6) // Show top 6 categories

  if (expenses.length === 0) {
    return (
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg shadow-lg">
              <PieChart className="h-5 w-5 text-white" />
            </div>
            Category Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <PieChart className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No expenses to show</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg shadow-lg">
            <PieChart className="h-5 w-5 text-white" />
          </div>
          Category Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedCategories.map(([category, amount]) => {
          const CategoryIcon = getCategoryIcon(category)
          const colors = getCategoryColor(category)
          const percentage = (amount / totalAmount) * 100

          return (
            <div key={category} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${colors.bg} ${colors.border} border`}>
                    <CategoryIcon className={`h-4 w-4 ${colors.icon}`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{category}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{percentage.toFixed(1)}%</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">${amount.toFixed(2)}</p>
                </div>
              </div>
              <Progress value={percentage} className="h-2" />
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
