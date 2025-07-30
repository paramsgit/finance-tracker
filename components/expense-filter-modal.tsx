"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"

interface ExpenseFilterModalProps {
  categories: string[]
  currentFilters: {
    dateFilter: string
    categoryFilter: string
    startDate: string
    endDate: string
    filterType: string
  }
  onApplyFilters: (filters: {
    dateFilter: string
    categoryFilter: string
    startDate: string
    endDate: string
    filterType: string
  }) => void
  onClose: () => void
}

export function ExpenseFilterModal({ categories, currentFilters, onApplyFilters, onClose }: ExpenseFilterModalProps) {
  const [filterType, setFilterType] = useState(currentFilters.filterType || "none")
  const [dateFilter, setDateFilter] = useState(currentFilters.dateFilter)
  const [categoryFilter, setCategoryFilter] = useState(currentFilters.categoryFilter)
  const [startDate, setStartDate] = useState(currentFilters.startDate)
  const [endDate, setEndDate] = useState(currentFilters.endDate)

  const handleApply = () => {
    onApplyFilters({
      dateFilter: filterType === "single" ? dateFilter : "",
      categoryFilter,
      startDate: filterType === "range" ? startDate : "",
      endDate: filterType === "range" ? endDate : "",
      filterType,
    })
    onClose()
  }

  const handleClear = () => {
    setFilterType("none")
    setDateFilter("")
    setCategoryFilter("all")
    setStartDate("")
    setEndDate("")
    onApplyFilters({
      dateFilter: "",
      categoryFilter: "all",
      startDate: "",
      endDate: "",
      filterType: "none",
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-gray-900 dark:text-white">Filter Expenses</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-gray-300">Date Filter</Label>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                <SelectItem value="none">No Date Filter</SelectItem>
                <SelectItem value="single">Single Date</SelectItem>
                <SelectItem value="range">Date Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filterType === "single" && (
            <div className="space-y-2">
              <Label htmlFor="dateFilter" className="text-gray-700 dark:text-gray-300">
                Select Date
              </Label>
              <Input
                id="dateFilter"
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          )}

          {filterType === "range" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-gray-700 dark:text-gray-300">
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-gray-700 dark:text-gray-300">
                  End Date
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-gray-300">Category Filter</Label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                <SelectValue />
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
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              variant="outline"
              onClick={handleClear}
              className="dark:border-gray-600 dark:hover:bg-gray-700 bg-transparent"
            >
              Clear All
            </Button>
            <Button onClick={handleApply}>Apply Filters</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
