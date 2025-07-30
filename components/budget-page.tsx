"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useBudget } from "@/hooks/use-budget";
import { useExpenses } from "@/hooks/use-expenses";
import { useCategories } from "@/hooks/use-categories";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { MonthSelector } from "@/components/month-selector";
import {
  AlertTriangle,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Edit,
  Save,
  X,
  Trash2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

export function BudgetPage() {
  const {
    getMonthlyBudget,
    setCategoryBudget,
    distributeBudgetEqually,
    redistributeBudget,
  } = useBudget();
  const { expenses } = useExpenses();
  const { categories } = useCategories();

  const currentDate = new Date();
  const currentMonthKey = `${currentDate.getFullYear()}-${String(
    currentDate.getMonth()
  ).padStart(2, "0")}`;
  const [selectedMonth, setSelectedMonth] = useState(currentMonthKey);
  const [totalBudget, setTotalBudget] = useState("");
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [showZeroBudgets, setShowZeroBudgets] = useState(false);

  const [year, monthIndex] = selectedMonth.split("-").map(Number);
  const monthlyBudget = getMonthlyBudget(selectedMonth);

  const monthExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return (
      expenseDate.getMonth() === monthIndex &&
      expenseDate.getFullYear() === year
    );
  });

  const categorySpending = monthExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const totalBudgetAmount = Object.values(monthlyBudget).reduce(
    (sum, amount) => sum + amount,
    0
  );
  const totalSpent = monthExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const remaining = totalBudgetAmount - totalSpent;
  const spentPercentage =
    totalBudgetAmount > 0 ? (totalSpent / totalBudgetAmount) * 100 : 0;
  const isOverBudget = totalSpent > totalBudgetAmount;

  // Separate categories with and without budgets
  const categoriesWithBudget = categories.filter(
    (cat) => (monthlyBudget[cat] || 0) > 0
  );
  const categoriesWithZeroBudget = categories.filter(
    (cat) => (monthlyBudget[cat] || 0) === 0
  );

  // Redistribute budget when categories change
  useEffect(() => {
    const budgetCategories = Object.keys(monthlyBudget);
    const missingCategories = categories.filter(
      (cat) => !budgetCategories.includes(cat)
    );
    const extraCategories = budgetCategories.filter(
      (cat) => !categories.includes(cat)
    );

    if (missingCategories.length > 0 || extraCategories.length > 0) {
      redistributeBudget(selectedMonth, categories);
    }
  }, [categories, selectedMonth, monthlyBudget, redistributeBudget]);

  const handleSetTotalBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const budgetValue = Number.parseFloat(totalBudget);
    if (budgetValue >= 0 && categories.length > 0) {
      distributeBudgetEqually(selectedMonth, budgetValue, categories);
      setTotalBudget("");
    }
  };

  const handleEditCategory = (category: string) => {
    setEditingCategory(category);
    setEditValue((monthlyBudget[category] || 0).toString());
  };

  const handleSaveCategory = () => {
    if (editingCategory) {
      const amount = Number.parseFloat(editValue);
      if (amount >= 0) {
        setCategoryBudget(selectedMonth, editingCategory, amount);
      }
      setEditingCategory(null);
      setEditValue("");
    }
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditValue("");
  };

  const handleDeleteCategoryBudget = (category: string) => {
    setCategoryBudget(selectedMonth, category, 0);
  };

  const selectedMonthLabel = new Date(year, monthIndex).toLocaleDateString(
    "en-US",
    {
      month: "long",
      year: "numeric",
    }
  );

  const renderCategoryBudget = (category: string) => {
    const budgetAmount = monthlyBudget[category] || 0;
    const spentAmount = categorySpending[category] || 0;
    const categoryRemaining = budgetAmount - spentAmount;
    const categoryPercentage =
      budgetAmount > 0 ? (spentAmount / budgetAmount) * 100 : 0;
    const isOverCategoryBudget = spentAmount > budgetAmount && budgetAmount > 0;

    return (
      <div
        key={category}
        className="space-y-2 p-4 border rounded-lg dark:border-gray-600"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900 dark:text-white">
              {category}
            </span>
            {isOverCategoryBudget && (
              <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
            )}
          </div>
          <div className="flex items-center gap-2">
            {editingCategory === category ? (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-24 h-8 dark:bg-gray-700 dark:border-gray-600"
                />
                <Button size="sm" onClick={handleSaveCategory}>
                  <Save className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  ${budgetAmount.toFixed(2)}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEditCategory(category)}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeleteCategoryBudget(category)}
                  className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
        {budgetAmount > 0 && (
          <>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Spent: ${spentAmount.toFixed(2)}</span>
              <span
                className={
                  categoryRemaining >= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }
              >
                {categoryRemaining >= 0 ? "Remaining" : "Over"}: $
                {Math.abs(categoryRemaining).toFixed(2)}
              </span>
            </div>
            <Progress
              value={Math.min(categoryPercentage, 100)}
              className="h-2"
            />
            {isOverCategoryBudget && (
              <p className="text-xs text-red-600 dark:text-red-400">
                Over budget by ${(spentAmount - budgetAmount).toFixed(2)}
              </p>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Budget
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Set and track your budget for {selectedMonthLabel}
          </p>
        </div>
        <MonthSelector
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
        />
      </div>

      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">
            Set Total Monthly Budget
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSetTotalBudget}
            className="flex flex-col md:flex-row gap-4 justify-start items-start md:items-end"
          >
            <div className="flex-1 w-full md:w-auto">
              <Label htmlFor="budget">Total Budget Amount</Label>
              <Input
                id="budget"
                type="number"
                step="0.01"
                min="0"
                value={totalBudget}
                onChange={(e) => setTotalBudget(e.target.value)}
                placeholder="0.00"
                className="dark:bg-gray-700 dark:border-gray-600 w-full"
              />
            </div>
            <Button
              type="submit"
              disabled={!totalBudget || categories.length === 0}
            >
              Distribute Equally
            </Button>
          </form>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            This will distribute the total budget equally among all{" "}
            {categories.length} categories
          </p>
        </CardContent>
      </Card>

      {totalBudgetAmount > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Budget
                </CardTitle>
                <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">
                  ${totalBudgetAmount.toFixed(2)}
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Spent
                </CardTitle>
                <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold text-red-600 dark:text-red-400">
                  ${totalSpent.toFixed(2)}
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Remaining
                </CardTitle>
                <TrendingUp
                  className={`h-4 w-4 ${
                    remaining >= 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                />
              </CardHeader>
              <CardContent>
                <div
                  className={`text-xl md:text-2xl font-bold ${
                    remaining >= 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  ${remaining.toFixed(2)}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                Overall Budget Progress
                {isOverBudget && (
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Spent: ${totalSpent.toFixed(2)}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    Budget: ${totalBudgetAmount.toFixed(2)}
                  </span>
                </div>
                <Progress
                  value={Math.min(spentPercentage, 100)}
                  className="h-3"
                />
                <div className="text-center">
                  {isOverBudget ? (
                    <p className="text-red-600 dark:text-red-400 font-medium">
                      ⚠️ Over budget by $
                      {(totalSpent - totalBudgetAmount).toFixed(2)} (
                      {(spentPercentage - 100).toFixed(1)}%)
                    </p>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400">
                      {(100 - spentPercentage).toFixed(1)}% of budget remaining
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">
                Category Budgets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Categories with budgets */}
                {categoriesWithBudget.map(renderCategoryBudget)}

                {/* Categories with zero budgets - collapsible */}
                {categoriesWithZeroBudget.length > 0 && (
                  <div className="border-t pt-4 dark:border-gray-600">
                    <Button
                      variant="ghost"
                      onClick={() => setShowZeroBudgets(!showZeroBudgets)}
                      className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                    >
                      {showZeroBudgets ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      Show Other Categories ({categoriesWithZeroBudget.length})
                    </Button>

                    {showZeroBudgets && (
                      <div className="mt-4 space-y-4">
                        {categoriesWithZeroBudget.map(renderCategoryBudget)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
