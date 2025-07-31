"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "@/components/theme-provider"
import { BarChart3 } from "lucide-react"
import type { Expense } from "@/types"

interface DailySpendingChartProps {
  expenses: Expense[]
}

export function DailySpendingChart({ expenses }: DailySpendingChartProps) {
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

    // Calculate daily totals
    const dailyTotals = expenses.reduce(
      (acc, expense) => {
        const date = expense.date
        acc[date] = (acc[date] || 0) + expense.amount
        return acc
      },
      {} as Record<string, number>,
    )

    const dates = Object.keys(dailyTotals).sort()
    const values = dates.map((date) => dailyTotals[date])

    if (values.length === 0) {
      ctx.fillStyle = theme === "dark" ? "#9ca3af" : "#6b7280"
      ctx.font = "16px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("No expenses to display", rect.width / 2, rect.height / 2)
      return
    }

    const maxValue = Math.max(...values)
    const padding = 50
    const chartWidth = rect.width - padding * 2
    const chartHeight = rect.height - padding * 2

    // Draw axes with enhanced styling
    ctx.strokeStyle = theme === "dark" ? "#374151" : "#e5e7eb"
    ctx.lineWidth = 2

    // Y-axis
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, rect.height - padding)
    ctx.stroke()

    // X-axis
    ctx.beginPath()
    ctx.moveTo(padding, rect.height - padding)
    ctx.lineTo(rect.width - padding, rect.height - padding)
    ctx.stroke()

    // Draw bars with enhanced styling
    const barWidth = chartWidth / dates.length
    const barSpacing = barWidth * 0.2

    dates.forEach((date, index) => {
      const value = dailyTotals[date]
      const barHeight = (value / maxValue) * chartHeight
      const x = padding + index * barWidth + barSpacing / 2
      const y = rect.height - padding - barHeight

      // Create gradient for bars
      const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight)
      gradient.addColorStop(0, "#3b82f6")
      gradient.addColorStop(1, "#1d4ed8")

      // Draw bar with shadow
      ctx.save()
      ctx.shadowColor = "rgba(59, 130, 246, 0.3)"
      ctx.shadowBlur = 8
      ctx.shadowOffsetY = 4

      ctx.fillStyle = gradient
      ctx.fillRect(x, y, barWidth - barSpacing, barHeight)

      ctx.restore()

      // Draw value on top of bar
      if (barHeight > 25) {
        ctx.fillStyle = "white"
        ctx.font = "bold 10px sans-serif"
        ctx.textAlign = "center"
        ctx.strokeStyle = "rgba(0, 0, 0, 0.3)"
        ctx.lineWidth = 2
        const text = `$${value.toFixed(0)}`
        ctx.strokeText(text, x + (barWidth - barSpacing) / 2, y + 18)
        ctx.fillText(text, x + (barWidth - barSpacing) / 2, y + 18)
      }

      // Draw date label
      ctx.fillStyle = theme === "dark" ? "#9ca3af" : "#6b7280"
      ctx.font = "11px sans-serif"
      ctx.textAlign = "center"
      const dateLabel = new Date(date).getDate().toString()
      ctx.fillText(dateLabel, x + (barWidth - barSpacing) / 2, rect.height - padding + 20)
    })

    // Draw Y-axis labels
    ctx.fillStyle = theme === "dark" ? "#9ca3af" : "#6b7280"
    ctx.font = "11px sans-serif"
    ctx.textAlign = "right"
    for (let i = 0; i <= 5; i++) {
      const value = (maxValue / 5) * i
      const y = rect.height - padding - (chartHeight / 5) * i
      ctx.fillText(`$${value.toFixed(0)}`, padding - 10, y + 4)
    }
  }, [expenses, theme])

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700 shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          Daily Spending
        </CardTitle>
      </CardHeader>
      <CardContent>
        <canvas ref={canvasRef} className="w-full h-64" style={{ width: "100%", height: "256px" }} />
      </CardContent>
    </Card>
  )
}
