"use client"

import { useState, useEffect } from "react"
import type { Expense } from "@/types"

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("expenses")
    if (saved) {
      setExpenses(JSON.parse(saved))
    }
  }, [])

  const saveExpenses = (newExpenses: Expense[]) => {
    setExpenses(newExpenses)
    localStorage.setItem("expenses", JSON.stringify(newExpenses))
  }

  const addExpense = (expenseData: Omit<Expense, "id">) => {
    const newExpense: Expense = {
      ...expenseData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    }
    saveExpenses([...expenses, newExpense])
  }

  const updateExpense = (id: string, expenseData: Omit<Expense, "id">) => {
    const updatedExpenses = expenses.map((expense) => (expense.id === id ? { ...expenseData, id } : expense))
    saveExpenses(updatedExpenses)
  }

  const deleteExpense = (id: string) => {
    const filteredExpenses = expenses.filter((expense) => expense.id !== id)
    saveExpenses(filteredExpenses)
  }

  return {
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
  }
}
