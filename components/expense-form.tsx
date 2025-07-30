"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !date || !category) return

    onSubmit({
      amount: Number.parseFloat(amount),
      date,
      category,
      note: note.trim() || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-gray-700 dark:text-gray-300">
            Amount
          </Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date" className="text-gray-700 dark:text-gray-300">
            Date
          </Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category" className="text-gray-700 dark:text-gray-300">
          Category
        </Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="note" className="text-gray-700 dark:text-gray-300">
          Note (Optional)
        </Label>
        <Textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note about this expense..."
          className="dark:bg-gray-700 dark:border-gray-600"
          rows={3}
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="dark:border-gray-600 dark:hover:bg-gray-700 bg-transparent"
        >
          Cancel
        </Button>
        <Button type="submit">{expense ? "Update" : "Add"} Expense</Button>
      </div>
    </form>
  )
}
