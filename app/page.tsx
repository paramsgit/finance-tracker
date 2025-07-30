"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { MobileNavbar } from "@/components/mobile-navbar"
import { Dashboard } from "@/components/dashboard"
import { ExpensesPage } from "@/components/expenses-page"
import { CategoriesPage } from "@/components/categories-page"
import { BudgetPage } from "@/components/budget-page"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard")

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />
      case "expenses":
        return <ExpensesPage />
      case "categories":
        return <CategoriesPage />
      case "budget":
        return <BudgetPage />
      default:
        return <Dashboard />
    }
  }

  return (
    <ThemeProvider>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Main Content - starts after sidebar */}
        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6 md:ml-64">{renderContent()}</main>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden">
          <MobileNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>
    </ThemeProvider>
  )
}
