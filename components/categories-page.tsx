"use client"

import type React from "react"
import { useState } from "react"
import { useCategories } from "@/hooks/use-categories"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Edit, Trash2 } from "lucide-react"

export function CategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories()
  const [newCategory, setNewCategory] = useState("")
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      addCategory(newCategory.trim())
      setNewCategory("")
    }
  }

  const handleEdit = (category: string) => {
    setEditingCategory(category)
    setEditValue(category)
  }

  const handleUpdate = () => {
    if (editValue.trim() && editValue !== editingCategory && !categories.includes(editValue.trim())) {
      updateCategory(editingCategory!, editValue.trim())
      setEditingCategory(null)
      setEditValue("")
    }
  }

  const handleCancel = () => {
    setEditingCategory(null)
    setEditValue("")
  }

  const defaultCategories = [
    "Food",
    "Transport",
    "Shopping",
    "Entertainment",
    "Bills",
    "Healthcare",
    "Education",
    "Other",
  ]
  const customCategories = categories.filter((cat) => !defaultCategories.includes(cat))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Categories</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your expense categories</p>
      </div>

      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Add New Category</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1">
              <Label htmlFor="category" className="sr-only">
                Category Name
              </Label>
              <Input
                id="category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter category name..."
                className="dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
            <Button type="submit">
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Default Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {defaultCategories
                .filter((cat) => categories.includes(cat))
                .map((category) => (
                  <div
                    key={category}
                    className="flex items-center justify-between p-3 border rounded-lg dark:border-gray-600"
                  >
                    <span className="text-gray-900 dark:text-white">{category}</span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(category)}
                        disabled={editingCategory === category}
                        className="dark:border-gray-600 dark:hover:bg-gray-700"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteCategory(category)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 dark:border-gray-600 dark:hover:bg-gray-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Custom Categories</CardTitle>
          </CardHeader>
          <CardContent>
            {customCategories.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No custom categories yet. Add one above!
              </div>
            ) : (
              <div className="space-y-2">
                {customCategories.map((category) => (
                  <div
                    key={category}
                    className="flex items-center justify-between p-3 border rounded-lg dark:border-gray-600"
                  >
                    {editingCategory === category ? (
                      <div className="flex-1 flex flex-col sm:flex-row gap-2">
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="flex-1 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleUpdate}>
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancel}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <span className="text-gray-900 dark:text-white">{category}</span>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(category)}
                            className="dark:border-gray-600 dark:hover:bg-gray-700"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteCategory(category)}
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 dark:border-gray-600 dark:hover:bg-gray-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
