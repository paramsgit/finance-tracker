"use client"

import { useState, useEffect } from "react"

const DEFAULT_CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Entertainment",
  "Bills",
  "Healthcare",
  "Education",
  "Other",
]

export function useCategories() {
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES)

  useEffect(() => {
    const saved = localStorage.getItem("categories")
    if (saved) {
      setCategories(JSON.parse(saved))
    }
  }, [])

  const saveCategories = (newCategories: string[]) => {
    setCategories(newCategories)
    localStorage.setItem("categories", JSON.stringify(newCategories))
  }

  const addCategory = (category: string) => {
    if (!categories.includes(category)) {
      saveCategories([...categories, category])
    }
  }

  const updateCategory = (oldCategory: string, newCategory: string) => {
    const updatedCategories = categories.map((cat) => (cat === oldCategory ? newCategory : cat))
    saveCategories(updatedCategories)
  }

  const deleteCategory = (category: string) => {
    const filteredCategories = categories.filter((cat) => cat !== category)
    saveCategories(filteredCategories)
  }

  return {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
  }
}
