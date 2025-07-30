"use client"

import { useState, useEffect } from "react"

export interface MonthlyBudget {
  [category: string]: number
}

export interface BudgetData {
  [monthKey: string]: MonthlyBudget
}

export function useBudget() {
  const [budgetData, setBudgetData] = useState<BudgetData>({})

  useEffect(() => {
    const saved = localStorage.getItem("budgetData")
    if (saved) {
      setBudgetData(JSON.parse(saved))
    }
  }, [])

  const saveBudgetData = (newBudgetData: BudgetData) => {
    setBudgetData(newBudgetData)
    localStorage.setItem("budgetData", JSON.stringify(newBudgetData))
  }

  const getMonthlyBudget = (monthKey: string): MonthlyBudget => {
    return budgetData[monthKey] || {}
  }

  const setMonthlyBudget = (monthKey: string, budget: MonthlyBudget) => {
    const newBudgetData = {
      ...budgetData,
      [monthKey]: budget,
    }
    saveBudgetData(newBudgetData)
  }

  const setCategoryBudget = (monthKey: string, category: string, amount: number) => {
    const monthlyBudget = getMonthlyBudget(monthKey)
    const newMonthlyBudget = {
      ...monthlyBudget,
      [category]: amount,
    }
    setMonthlyBudget(monthKey, newMonthlyBudget)
  }

  const distributeBudgetEqually = (monthKey: string, totalBudget: number, categories: string[]) => {
    if (categories.length === 0) return

    const amountPerCategory = totalBudget / categories.length
    const newBudget: MonthlyBudget = {}

    categories.forEach((category) => {
      newBudget[category] = amountPerCategory
    })

    setMonthlyBudget(monthKey, newBudget)
  }

  const redistributeBudget = (monthKey: string, categories: string[]) => {
    const currentBudget = getMonthlyBudget(monthKey)
    const totalBudget = Object.values(currentBudget).reduce((sum, amount) => sum + amount, 0)

    if (totalBudget > 0 && categories.length > 0) {
      distributeBudgetEqually(monthKey, totalBudget, categories)
    }
  }

  return {
    budgetData,
    getMonthlyBudget,
    setMonthlyBudget,
    setCategoryBudget,
    distributeBudgetEqually,
    redistributeBudget,
  }
}
