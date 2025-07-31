"use client"

import { useState } from "react"
import { useExpenses } from "@/hooks/use-expenses"
import { useCategories } from "@/hooks/use-categories"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExpenseForm } from "@/components/expense-form"
import { DateRangeSelector } from "@/components/date-range-selector"
import { ExpenseFilterModal } from "@/components/expense-filter-modal"
import { MonthlyExpenseList } from "@/components/monthly-expense-list"
import { Plus, Download, Filter, ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import type { Expense } from "@/types"

export function ExpensesPage() {
  const { expenses, addExpense, updateExpense, deleteExpense } = useExpenses()
  const { categories } = useCategories()
  const [showForm, setShowForm] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)

  // Current month navigation
  const currentDate = new Date()
  const currentMonthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth()).padStart(2, "0")}`
  const [selectedMonth, setSelectedMonth] = useState(currentMonthKey)

  const [filters, setFilters] = useState({
    dateFilter: "",
    categoryFilter: "all",
    startDate: "",
    endDate: "",
    filterType: "none",
  })

  // Parse selected month
  const [year, monthIndex] = selectedMonth.split("-").map(Number)
  const selectedMonthDate = new Date(year, monthIndex)

  // Navigate months
  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(selectedMonthDate)
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    const newMonthKey = `${newDate.getFullYear()}-${String(newDate.getMonth()).padStart(2, "0")}`
    setSelectedMonth(newMonthKey)
  }

  // Filter expenses for selected month
  const monthExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date)
    const expenseMonthKey = `${expenseDate.getFullYear()}-${String(expenseDate.getMonth()).padStart(2, "0")}`
    return expenseMonthKey === selectedMonth
  })

  // Apply additional filters
  const filteredExpenses = monthExpenses.filter((expense) => {
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
  const selectedMonthLabel = selectedMonthDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  const totalMonthAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)

  if (showForm) {
    return (
      <div className="space-y-6">
        {/* Header with back navigation */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          >
            ← Back to Expenses
          </Button>
        </div>

        {/* Form Card */}
        <Card className="dark:bg-gray-800 dark:border-gray-700 shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {editingExpense ? "Edit Your Expense" : "Add New Expense"}
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {editingExpense ? "Update the details below" : "Track your spending in just a few clicks"}
            </p>
          </CardHeader>
          <CardContent className="px-6 pb-8">
            <ExpenseForm
              expense={editingExpense}
              categories={categories}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Expenses
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Track and manage your daily expenses</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => setShowFilterModal(true)}
            variant="outline"
            className={`dark:border-gray-600 dark:hover:bg-gray-700 transition-all duration-200 ${
              hasActiveFilters
                ? "bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-900/20 dark:border-blue-600 dark:text-blue-300 shadow-md"
                : "hover:shadow-md"
            }`}
          >
            <Filter className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Filters</span>
            {hasActiveFilters && <span className="ml-1">({filteredExpenses.length})</span>}
          </Button>
          <Button
            onClick={() => setShowExportDialog(true)}
            variant="outline"
            className="dark:border-gray-600 dark:hover:bg-gray-700 hover:shadow-md transition-all duration-200"
          >
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        </div>
      </div>

      {/* Month Navigation */}
      <Card className="dark:bg-gray-800 dark:border-gray-700 shadow-lg border-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth("prev")}
              className="hover:bg-white/50 dark:hover:bg-gray-700/50"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/70 dark:bg-gray-700/70 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedMonthLabel}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {filteredExpenses.length} expenses • ${totalMonthAmount.toFixed(2)}
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth("next")}
              className="hover:bg-white/50 dark:hover:bg-gray-700/50"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

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

      {/* Monthly Expense List */}
      <MonthlyExpenseList expenses={filteredExpenses} onEdit={handleEdit} onDelete={deleteExpense} />
    </div>
  )
}
