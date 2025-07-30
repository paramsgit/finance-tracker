"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "@/components/theme-provider"
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
    const padding = 40
    const chartWidth = rect.width - padding * 2
    const chartHeight = rect.height - padding * 2

    // Draw axes
    ctx.strokeStyle = theme === "dark" ? "#374151" : "#e5e7eb"
    ctx.lineWidth = 1

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

    // Draw bars
    const barWidth = chartWidth / dates.length
    const barSpacing = barWidth * 0.1

    dates.forEach((date, index) => {
      const value = dailyTotals[date]
      const barHeight = (value / maxValue) * chartHeight
      const x = padding + index * barWidth + barSpacing / 2
      const y = rect.height - padding - barHeight

      // Draw bar
      ctx.fillStyle = "#3b82f6"
      ctx.fillRect(x, y, barWidth - barSpacing, barHeight)

      // Draw value on top of bar
      if (barHeight > 20) {
        ctx.fillStyle = "white"
        ctx.font = "10px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(`$${value.toFixed(0)}`, x + (barWidth - barSpacing) / 2, y + 15)
      }

      // Draw date label
      ctx.fillStyle = theme === "dark" ? "#9ca3af" : "#6b7280"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      const dateLabel = new Date(date).getDate().toString()
      ctx.fillText(dateLabel, x + (barWidth - barSpacing) / 2, rect.height - padding + 15)
    })

    // Draw Y-axis labels
    ctx.fillStyle = theme === "dark" ? "#9ca3af" : "#6b7280"
    ctx.font = "10px sans-serif"
    ctx.textAlign = "right"
    for (let i = 0; i <= 5; i++) {
      const value = (maxValue / 5) * i
      const y = rect.height - padding - (chartHeight / 5) * i
      ctx.fillText(`$${value.toFixed(0)}`, padding - 5, y + 3)
    }
  }, [expenses, theme])

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">Daily Spending</CardTitle>
      </CardHeader>
      <CardContent>
        <canvas ref={canvasRef} className="w-full h-64" style={{ width: "100%", height: "256px" }} />
      </CardContent>
    </Card>
  )
}
