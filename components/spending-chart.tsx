"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "@/components/theme-provider"
import { PieChart } from "lucide-react"
import type { Expense } from "@/types"

interface SpendingChartProps {
  expenses: Expense[]
}

export function SpendingChart({ expenses }: SpendingChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Calculate category totals
    const categoryTotals = expenses.reduce(
      (acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount
        return acc
      },
      {} as Record<string, number>,
    )

    const categories = Object.keys(categoryTotals)
    const values = Object.values(categoryTotals)
    const total = values.reduce((sum, value) => sum + value, 0)

    if (total === 0) {
      ctx.fillStyle = theme === "dark" ? "#9ca3af" : "#6b7280"
      ctx.font = "16px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("No expenses to display", rect.width / 2, rect.height / 2)
      return
    }

    // Enhanced colors for pie chart
    const colors = [
      "#3b82f6", // Blue
      "#ef4444", // Red
      "#10b981", // Green
      "#f59e0b", // Amber
      "#8b5cf6", // Purple
      "#06b6d4", // Cyan
      "#84cc16", // Lime
      "#f97316", // Orange
      "#ec4899", // Pink
      "#6366f1", // Indigo
    ]

    // Draw pie chart with enhanced styling
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const radius = Math.min(centerX, centerY) - 50

    let currentAngle = -Math.PI / 2

    categories.forEach((category, index) => {
      const value = categoryTotals[category]
      const sliceAngle = (value / total) * 2 * Math.PI

      // Draw slice with shadow
      ctx.save()
      ctx.shadowColor = "rgba(0, 0, 0, 0.1)"
      ctx.shadowBlur = 10
      ctx.shadowOffsetX = 2
      ctx.shadowOffsetY = 2

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle)
      ctx.closePath()
      ctx.fillStyle = colors[index % colors.length]
      ctx.fill()

      ctx.restore()

      // Draw label with better positioning
      const labelAngle = currentAngle + sliceAngle / 2
      const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7)
      const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7)

      ctx.fillStyle = "white"
      ctx.font = "bold 11px sans-serif"
      ctx.textAlign = "center"
      ctx.strokeStyle = "rgba(0, 0, 0, 0.3)"
      ctx.lineWidth = 2
      const percentage = ((value / total) * 100).toFixed(1)
      ctx.strokeText(`${percentage}%`, labelX, labelY)
      ctx.fillText(`${percentage}%`, labelX, labelY)

      currentAngle += sliceAngle
    })
  }, [expenses, theme])

  // Calculate category totals for legend
  const categoryTotals = expenses.reduce(
    (acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    },
    {} as Record<string, number>,
  )

  const sortedCategories = Object.entries(categoryTotals).sort(([, a], [, b]) => b - a)

  const colors = [
    "#3b82f6",
    "#ef4444",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#06b6d4",
    "#84cc16",
    "#f97316",
    "#ec4899",
    "#6366f1",
  ]

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700 shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <PieChart className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          Spending by Category
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <canvas ref={canvasRef} className="w-full h-64" style={{ width: "100%", height: "256px" }} />
          {sortedCategories.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {sortedCategories.map(([category, amount], index) => (
                <div key={category} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  <span className="truncate text-gray-700 dark:text-gray-300 font-medium">{category}</span>
                  <span className="ml-auto font-semibold text-gray-900 dark:text-white">${amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
