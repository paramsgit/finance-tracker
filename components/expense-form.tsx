"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getCategoryIcon, getCategoryColor } from "@/utils/category-icons"
import { Calendar, DollarSign, FileText, Check, X } from "lucide-react"
import type { Expense } from "@/types"

interface ExpenseFormProps {
  expense?: Expense | null
  categories: string[]
  onSubmit: (expense: Omit<Expense, "id">) => void
  onCancel: () => void
}

export function ExpenseForm({ expense, categories, onSubmit, onCancel }: ExpenseFormProps) {
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState("")
  const [category, setCategory] = useState("")
  const [note, setNote] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (expense) {
      setAmount(expense.amount.toString())
      setDate(expense.date)
      setCategory(expense.category)
      setNote(expense.note || "")
    } else {
      setAmount("")
      setDate(new Date().toISOString().split("T")[0])
      setCategory("")
      setNote("")
    }
  }, [expense])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !date || !category) return

    setIsSubmitting(true)

    // Add a small delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 300))

    onSubmit({
      amount: Number.parseFloat(amount),
      date,
      category,
      note: note.trim() || undefined,
    })

    setIsSubmitting(false)
  }

  const isFormValid = amount && date && category

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amount Input - Featured */}
        <div className="text-center space-y-2">
          <Label className="text-lg font-medium text-gray-700 dark:text-gray-300">How much did you spend?</Label>
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
            <Input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="text-center text-3xl font-bold h-16 pl-12 pr-4 border-2 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:border-blue-400"
              required
            />
          </div>
        </div>

        {/* Date Input */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-base font-medium text-gray-700 dark:text-gray-300">
            <Calendar className="h-4 w-4" />
            When did you spend it?
          </Label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-12 text-base border-2 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:border-blue-400"
            required
          />
        </div>

        {/* Category Selection */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-base font-medium text-gray-700 dark:text-gray-300">
            What category?
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {categories.map((cat) => {
              const CategoryIcon = getCategoryIcon(cat)
              const colors = getCategoryColor(cat)
              const isSelected = category === cat

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`p-4 rounded-xl border-2 text-sm font-medium transition-all duration-200 hover:scale-105 ${
                    isSelected
                      ? `${colors.bg} ${colors.text} ${colors.border} ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-800 shadow-lg`
                      : "bg-white border-gray-200 text-gray-700 hover:border-gray-300 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500 hover:shadow-md"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <CategoryIcon
                      className={`h-6 w-6 ${isSelected ? colors.icon : "text-gray-500 dark:text-gray-400"}`}
                    />
                    <span>{cat}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Note Input */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-base font-medium text-gray-700 dark:text-gray-300">
            <FileText className="h-4 w-4" />
            Add a note (optional)
          </Label>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What was this expense for?"
            className="resize-none border-2 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:border-blue-400"
            rows={3}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1 h-12 text-base border-2 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 bg-transparent"
            disabled={isSubmitting}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="flex-1 h-12 text-base bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </div>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                {expense ? "Update Expense" : "Add Expense"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
