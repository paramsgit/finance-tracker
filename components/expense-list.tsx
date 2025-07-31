"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, Search, Calendar, DollarSign, Tag } from "lucide-react"
import type { Expense } from "@/types"

interface ExpenseListProps {
  expenses: Expense[]
  onEdit: (expense: Expense) => void
  onDelete: (id: string) => void
}

export function ExpenseList({ expenses, onEdit, onDelete }: ExpenseListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date-desc")

  const categories = Array.from(new Set(expenses.map((e) => e.category)))

  const filteredAndSortedExpenses = expenses
    .filter((expense) => {
      const matchesSearch =
        expense.note?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = categoryFilter === "all" || expense.category === categoryFilter
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        case "amount-desc":
          return b.amount - a.amount
        case "amount-asc":
          return a.amount - b.amount
        default:
          return 0
      }
    })

  const getCategoryColor = (category: string) => {
    const colors = {
      Food: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
      Transport: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      Shopping: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      Entertainment: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
      Bills: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      Healthcare: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      Education: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
      Other: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
    }
    return colors[category as keyof typeof colors] || colors.Other
  }

  const totalAmount = filteredAndSortedExpenses.reduce((sum, expense) => sum + expense.amount, 0)

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700 shadow-lg">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              All Expenses ({expenses.length})
            </CardTitle>
            {filteredAndSortedExpenses.length > 0 && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Total: <span className="font-semibold">${totalAmount.toFixed(2)}</span>
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
            <Input
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 border-2 focus:border-blue-500 dark:focus:border-blue-400"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-48 dark:bg-gray-700 dark:border-gray-600 border-2 focus:border-blue-500 dark:focus:border-blue-400">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48 dark:bg-gray-700 dark:border-gray-600 border-2 focus:border-blue-500 dark:focus:border-blue-400">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
              <SelectItem value="date-desc">Date (Newest)</SelectItem>
              <SelectItem value="date-asc">Date (Oldest)</SelectItem>
              <SelectItem value="amount-desc">Amount (High to Low)</SelectItem>
              <SelectItem value="amount-asc">Amount (Low to High)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {filteredAndSortedExpenses.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {expenses.length === 0 ? "No expenses yet" : "No expenses match your filters"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {expenses.length === 0
                ? "Add your first expense to get started!"
                : "Try adjusting your search or filters."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAndSortedExpenses.map((expense) => (
              <div
                key={expense.id}
                className="group p-4 border-2 border-gray-100 dark:border-gray-700 rounded-xl hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md transition-all duration-200 bg-white dark:bg-gray-800/50"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <div className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />$
                        {expense.amount.toFixed(2)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4" />
                        {new Date(expense.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${getCategoryColor(expense.category)}`}
                      >
                        <Tag className="h-3 w-3" />
                        {expense.category}
                      </div>
                    </div>
                    {expense.note && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
                        {expense.note}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(expense)}
                      className="dark:border-gray-600 dark:hover:bg-gray-700 hover:border-blue-300 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDelete(expense.id)}
                      className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 dark:border-gray-600 dark:hover:bg-gray-700 hover:border-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
