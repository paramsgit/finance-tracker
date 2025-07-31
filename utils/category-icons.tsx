import {
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Gamepad2,
  Receipt,
  Heart,
  GraduationCap,
  MoreHorizontal,
} from "lucide-react"

export const categoryIcons = {
  Food: UtensilsCrossed,
  Transport: Car,
  Shopping: ShoppingBag,
  Entertainment: Gamepad2,
  Bills: Receipt,
  Healthcare: Heart,
  Education: GraduationCap,
  Other: MoreHorizontal,
}

export const getCategoryIcon = (category: string) => {
  return categoryIcons[category as keyof typeof categoryIcons] || categoryIcons.Other
}

export const getCategoryColor = (category: string) => {
  const colors = {
    Food: {
      bg: "bg-orange-100 dark:bg-orange-900/30",
      text: "text-orange-800 dark:text-orange-300",
      border: "border-orange-200 dark:border-orange-800",
      icon: "text-orange-600 dark:text-orange-400",
    },
    Transport: {
      bg: "bg-blue-100 dark:bg-blue-900/30",
      text: "text-blue-800 dark:text-blue-300",
      border: "border-blue-200 dark:border-blue-800",
      icon: "text-blue-600 dark:text-blue-400",
    },
    Shopping: {
      bg: "bg-purple-100 dark:bg-purple-900/30",
      text: "text-purple-800 dark:text-purple-300",
      border: "border-purple-200 dark:border-purple-800",
      icon: "text-purple-600 dark:text-purple-400",
    },
    Entertainment: {
      bg: "bg-pink-100 dark:bg-pink-900/30",
      text: "text-pink-800 dark:text-pink-300",
      border: "border-pink-200 dark:border-pink-800",
      icon: "text-pink-600 dark:text-pink-400",
    },
    Bills: {
      bg: "bg-red-100 dark:bg-red-900/30",
      text: "text-red-800 dark:text-red-300",
      border: "border-red-200 dark:border-red-800",
      icon: "text-red-600 dark:text-red-400",
    },
    Healthcare: {
      bg: "bg-green-100 dark:bg-green-900/30",
      text: "text-green-800 dark:text-green-300",
      border: "border-green-200 dark:border-green-800",
      icon: "text-green-600 dark:text-green-400",
    },
    Education: {
      bg: "bg-indigo-100 dark:bg-indigo-900/30",
      text: "text-indigo-800 dark:text-indigo-300",
      border: "border-indigo-200 dark:border-indigo-800",
      icon: "text-indigo-600 dark:text-indigo-400",
    },
    Other: {
      bg: "bg-gray-100 dark:bg-gray-900/30",
      text: "text-gray-800 dark:text-gray-300",
      border: "border-gray-200 dark:border-gray-800",
      icon: "text-gray-600 dark:text-gray-400",
    },
  }
  return colors[category as keyof typeof colors] || colors.Other
}
