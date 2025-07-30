"use client"

import { useState } from "react"
import { useExpenses } from "@/hooks/use-expenses"
import { useCategories } from "@/hooks/use-categories"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExpenseForm } from "@/components/expense-form"
import { ExpenseList } from "@/components/expense-list"
import { DateRangeSelector } from "@/components/date-range-selector"
import { ExpenseFilterModal } from "@/components/expense-filter-modal"
import { Plus, Download, Filter } from "lucide-react"
import type { Expense } from "@/types"

export function ExpensesPage() {
  const { expenses, addExpense, updateExpense, deleteExpense } = useExpenses()
  const { categories } = useCategories()
  const [showForm, setShowForm] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)

  const [filters, setFilters] = useState({
    dateFilter: "",
    categoryFilter: "all",
    startDate: "",
    endDate: "",
    filterType: "none",
  })

  const filteredExpenses = expenses.filter((expense) => {
    // Date filtering
    if (filters.filterType === "single" && filters.dateFilter) {
      if (expense.date !== filters.dateFilter) return false
    }

    if (filters.filterType === "range" && filters.startDate && filters.endDate) {
      if (expense.date < filters.startDate || expense.date > filters.endDate) return false
    }

    // Category filtering
    if (filters.categoryFilter !== "all" && expense.category !== filters.categoryFilter) {
      return false
    }

    return true
  })

  const handleSubmit = (expenseData: Omit<Expense, "id">) => {
    if (editingExpense) {
      updateExpense(editingExpense.id, expenseData)
      setEditingExpense(null)
    } else {
      addExpense(expenseData)
    }
    setShowForm(false)
  }

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense)
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingExpense(null)
  }

  const exportToCSV = (startDate?: string, endDate?: string) => {
    let expensesToExport = expenses

    if (startDate && endDate) {
      expensesToExport = expenses.filter((expense) => expense.date >= startDate && expense.date <= endDate)
    }

    const headers = ["Date", "Amount", "Category", "Note"]
    const csvContent = [
      headers.join(","),
      ...expensesToExport.map((expense) =>
        [expense.date, expense.amount.toString(), expense.category, `"${expense.note || ""}"`].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url

    const dateRange = startDate && endDate ? `${startDate}_to_${endDate}` : "all"
    a.download = `expenses-${dateRange}-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    setShowExportDialog(false)
  }

  const hasActiveFilters = filters.filterType !== "none" || filters.categoryFilter !== "all"

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Expenses</h1>
          <p className="text-gray-600 dark:text-gray-400">Track and manage your daily expenses</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => setShowFilterModal(true)}
            variant="outline"
            className={`dark:border-gray-600 dark:hover:bg-gray-700 ${
              hasActiveFilters
                ? "bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-900/20 dark:border-blue-600 dark:text-blue-300"
                : ""
            }`}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters {hasActiveFilters && `(${filteredExpenses.length})`}
          </Button>
          <Button
            onClick={() => setShowExportDialog(true)}
            variant="outline"
            className="dark:border-gray-600 dark:hover:bg-gray-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        </div>
      </div>

      {showFilterModal && (
        <ExpenseFilterModal
          categories={categories}
          currentFilters={filters}
          onApplyFilters={setFilters}
          onClose={() => setShowFilterModal(false)}
        />
      )}

      {showExportDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <DateRangeSelector onExport={exportToCSV} onCancel={() => setShowExportDialog(false)} />
        </div>
      )}

      {showForm && (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              {editingExpense ? "Edit Expense" : "Add New Expense"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ExpenseForm
              expense={editingExpense}
              categories={categories}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </CardContent>
        </Card>
      )}

      <ExpenseList expenses={filteredExpenses} onEdit={handleEdit} onDelete={deleteExpense} />
    </div>
  )
}
