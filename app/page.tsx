"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Calendar,
  Clock,
  Plus,
  Circle,
  AlertCircle,
  Star,
  Edit2,
  Sun,
  Moon,
  CheckCircle,
  Heart,
  Settings,
  Trash2,
} from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Task {
  id: string
  title: string
  description: string
  dueDate: string
  dueTime: string
  priority: "alta" | "media" | "baja"
  category: string
  completed: boolean
  createdAt: string
}

function getTodayDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, "0")
  const day = String(today.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export default function TaskScheduler() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isProfessionalMode, setIsProfessionalMode] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [statusFilter, setStatusFilter] = useState<"todas" | "pendientes" | "completadas">("todas")
  const [priorityFilter, setPriorityFilter] = useState<string>("todas")
  const [filterCategory, setFilterCategory] = useState<string>("todas")
  const [newTask, setNewTask] = useState<Omit<Task, "id" | "completed">>({
    title: "",
    description: "",
    dueDate: "",
    dueTime: "",
    priority: "media",
    category: "trabajo",
  })

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks")
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark")
    } else {
      setIsDarkMode(true)
    }
    const savedProfessionalMode = localStorage.getItem("professionalMode")
    if (savedProfessionalMode) {
      setIsProfessionalMode(savedProfessionalMode === "true")
    }
  }, [])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    localStorage.setItem("theme", isDarkMode ? "dark" : "light")
  }, [isDarkMode])

  useEffect(() => {
    localStorage.setItem("professionalMode", isProfessionalMode.toString())
  }, [isProfessionalMode])

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

  const startEditTask = (task: Task) => {
    setEditingTask(task)
    setNewTask({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      dueTime: task.dueTime,
      priority: task.priority,
      category: task.category,
    })
    setIsDialogOpen(true)
  }

  const updateTask = () => {
    if (!newTask.title.trim() || !editingTask) return

    const updatedTask: Task = {
      ...editingTask,
      title: newTask.title,
      description: newTask.description,
      dueDate: newTask.dueDate,
      dueTime: newTask.dueTime,
      priority: newTask.priority,
      category: newTask.category,
    }

    setTasks((prev) => prev.map((task) => (task.id === editingTask.id ? updatedTask : task)))
    resetForm()
  }

  const resetForm = () => {
    setNewTask({
      title: "",
      description: "",
      dueDate: "",
      dueTime: "",
      priority: "media",
      category: "trabajo",
    })
    setEditingTask(null)
    setIsDialogOpen(false)
  }

  const addTask = () => {
    if (!newTask.title.trim()) return

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      dueDate: newTask.dueDate,
      dueTime: newTask.dueTime,
      priority: newTask.priority,
      category: newTask.category,
      completed: false,
      createdAt: new Date().toISOString(),
    }

    setTasks((prev) => [...prev, task])
    resetForm()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingTask) {
      updateTask()
    } else {
      addTask()
    }
  }

  const toggleTask = (id: string) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const toggleProfessionalMode = () => {
    setIsProfessionalMode(!isProfessionalMode)
  }

  const getPriorityColor = (priority: string) => {
    if (isProfessionalMode) {
      if (isDarkMode) {
        switch (priority) {
          case "alta":
            return "bg-red-900/30 text-red-200 border-red-600/50"
          case "media":
            return "bg-amber-900/30 text-amber-200 border-amber-600/50"
          case "baja":
            return "bg-emerald-900/30 text-emerald-200 border-emerald-600/50"
          default:
            return "bg-slate-800/30 text-slate-300 border-slate-600/50"
        }
      } else {
        switch (priority) {
          case "alta":
            return "bg-red-50 text-red-900 border-red-300"
          case "media":
            return "bg-amber-50 text-amber-900 border-amber-300"
          case "baja":
            return "bg-emerald-50 text-emerald-900 border-emerald-300"
          default:
            return "bg-slate-50 text-slate-900 border-slate-300"
        }
      }
    } else {
      if (isDarkMode) {
        switch (priority) {
          case "alta":
            return "bg-red-900/30 text-red-300 border-red-700/50"
          case "media":
            return "bg-yellow-900/30 text-yellow-300 border-yellow-700/50"
          case "baja":
            return "bg-green-900/30 text-green-300 border-green-700/50"
          default:
            return "bg-gray-800/30 text-gray-300 border-gray-700/50"
        }
      } else {
        switch (priority) {
          case "alta":
            return "bg-red-100 text-red-800 border-red-200"
          case "media":
            return "bg-yellow-100 text-yellow-800 border-yellow-200"
          case "baja":
            return "bg-green-100 text-green-800 border-green-200"
          default:
            return "bg-gray-100 text-gray-800 border-gray-200"
        }
      }
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "alta":
        return <AlertCircle className="w-4 h-4" />
      case "media":
        return <Clock className="w-4 h-4" />
      case "baja":
        return <Circle className="w-4 h-4" />
      default:
        return <Circle className="w-4 h-4" />
    }
  }

  const filteredTasks = tasks
    .filter((task) => {
      const statusMatch =
        statusFilter === "todas" ||
        (statusFilter === "pendientes" && !task.completed) ||
        (statusFilter === "completadas" && task.completed)

      const priorityMatch = priorityFilter === "todas" || task.priority === priorityFilter

      const categoryMatch = filterCategory === "todas" || task.category === filterCategory

      return statusMatch && priorityMatch && categoryMatch
    })
    .sort((a, b) => {
      const today = getTodayDate()

      const aIsToday = a.dueDate === today
      const bIsToday = b.dueDate === today

      if (aIsToday && !bIsToday) return -1
      if (!aIsToday && bIsToday) return 1

      if (a.dueDate !== b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      }

      if (a.dueTime && b.dueTime) {
        return a.dueTime.localeCompare(b.dueTime)
      }

      if (a.dueTime && !b.dueTime) return -1
      if (!a.dueTime && b.dueTime) return 1

      const priorityOrder = { alta: 3, media: 2, baja: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })

  const todayTasks = tasks.filter((task) => {
    if (!task.dueDate) return false
    const today = getTodayDate()
    return task.dueDate === today && !task.completed
  })

  const overdueTasks = tasks.filter((task) => {
    if (!task.dueDate) return false
    const today = getTodayDate()
    const now = new Date()
    const currentTime = now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0")

    if (task.dueDate < today) {
      // Task is from a previous date
      return !task.completed
    } else if (task.dueDate === today && task.dueTime && task.dueTime < currentTime) {
      // Task is for today but time has passed
      return !task.completed
    }
    return false
  })

  const completedTasks = tasks.filter((task) => task.completed)

  return (
    <div
      className={`min-h-screen p-4 relative overflow-hidden transition-all duration-500 ${
        isProfessionalMode
          ? "bg-gradient-to-br from-slate-100 via-gray-100 to-blue-100 dark:from-slate-900 dark:via-gray-900 dark:to-blue-900"
          : "bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900"
      }`}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={`absolute top-10 left-10 w-2 h-2 rounded-full animate-ping opacity-70 ${
            isProfessionalMode ? "bg-blue-600 dark:bg-blue-400" : "bg-purple-600 dark:bg-purple-400"
          }`}
        ></div>
        <div
          className={`absolute top-32 right-16 w-3 h-3 rounded-full animate-pulse opacity-60 ${
            isProfessionalMode ? "bg-slate-600 dark:bg-slate-400" : "bg-blue-600 dark:bg-blue-400"
          }`}
        ></div>
        <div
          className={`absolute top-64 left-32 w-1 h-1 rounded-full animate-bounce opacity-80 ${
            isProfessionalMode ? "bg-gray-600 dark:bg-gray-400" : "bg-pink-600 dark:bg-pink-400"
          }`}
        ></div>
        <div
          className={`absolute bottom-32 right-24 w-2 h-2 rounded-full animate-ping opacity-50 ${
            isProfessionalMode ? "bg-blue-600 dark:bg-blue-400" : "bg-indigo-600 dark:bg-indigo-400"
          }`}
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className={`absolute bottom-64 left-16 w-3 h-3 rounded-full animate-pulse opacity-70 ${
            isProfessionalMode ? "bg-slate-600 dark:bg-slate-400" : "bg-cyan-600 dark:bg-cyan-400"
          }`}
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className={`absolute top-1/2 right-1/2 transform translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse ${
            isProfessionalMode ? "bg-blue-600 dark:bg-blue-400" : "bg-violet-600 dark:bg-violet-400"
          }`}
          style={{ animationDelay: "3s" }}
        ></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-8 sm:mb-12 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-6">
            <h1
              className={`text-3xl sm:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent drop-shadow-sm ${
                isProfessionalMode
                  ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-300 dark:via-teal-300 dark:to-cyan-300"
                  : "bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 dark:from-purple-300 dark:via-pink-300 dark:to-indigo-300"
              }`}
            >
              Gestor de tareas
            </h1>
            <div className="flex gap-4 items-center">
              <Button
                onClick={toggleTheme}
                variant="ghost"
                size="sm"
                className={`rounded-full p-3 transition-all duration-300 shadow-lg ${
                  isProfessionalMode
                    ? "text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100/70 dark:text-emerald-200 dark:hover:text-emerald-100 dark:hover:bg-emerald-500/20 border border-emerald-200/30"
                    : "text-purple-700 hover:text-purple-800 hover:bg-purple-200/50 dark:text-purple-200 dark:hover:text-purple-100 dark:hover:bg-purple-500/20"
                }`}
              >
                {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
              </Button>
              <Button
                onClick={toggleProfessionalMode}
                variant="ghost"
                size="sm"
                className={`rounded-full p-3 transition-all duration-300 shadow-lg ${
                  isProfessionalMode
                    ? "text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100/70 dark:text-emerald-200 dark:hover:text-emerald-100 dark:hover:bg-emerald-500/20 border border-emerald-200/30"
                    : "text-purple-700 hover:text-purple-800 hover:bg-purple-200/50 dark:text-purple-200 dark:hover:text-purple-100 dark:hover:bg-purple-500/20"
                }`}
                title={isProfessionalMode ? "Cambiar a modo colorido" : "Cambiar a modo normal"}
              >
                {isProfessionalMode ? <Heart className="w-6 h-6" /> : <Settings className="w-6 h-6" />}
              </Button>
            </div>
          </div>
          <p
            className={`text-base sm:text-lg font-medium px-4 mb-4 ${
              isProfessionalMode ? "text-emerald-700 dark:text-emerald-200" : "text-purple-700 dark:text-purple-200"
            }`}
          >
            {isProfessionalMode ? "📊 Organiza tu tiempo y tareas" : "📋 Organiza tu tiempo y tareas"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8 px-2 sm:px-0">
          <Card
            className={`backdrop-blur-sm shadow-xl rounded-3xl transform hover:scale-105 transition-all duration-300 ${
              isProfessionalMode
                ? "bg-gradient-to-br from-slate-200/80 to-slate-300/80 border border-slate-400/50 dark:from-slate-800/80 dark:to-slate-700/80 dark:border-slate-500/30"
                : "bg-gradient-to-br from-purple-200/80 to-purple-300/80 border border-purple-400/50 dark:from-purple-800/80 dark:to-purple-700/80 dark:border-purple-500/30"
            }`}
          >
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-xs sm:text-sm font-medium ${
                      isProfessionalMode ? "text-slate-600 dark:text-slate-300" : "text-purple-600 dark:text-purple-300"
                    }`}
                  >
                    {isProfessionalMode ? "📊" : "💖"} Total Tareas
                  </p>
                  <p
                    className={`text-xl sm:text-2xl font-bold ${
                      isProfessionalMode ? "text-slate-800 dark:text-slate-100" : "text-purple-800 dark:text-purple-100"
                    }`}
                  >
                    {tasks.length}
                  </p>
                </div>
                <Star
                  className={`w-6 h-6 sm:w-8 sm:h-8 ${
                    isProfessionalMode ? "text-slate-500 dark:text-slate-400" : "text-purple-500 dark:text-purple-400"
                  }`}
                />
              </div>
            </CardContent>
          </Card>

          <Card
            className={`backdrop-blur-sm shadow-xl rounded-3xl transform hover:scale-105 transition-all duration-300 ${
              isProfessionalMode
                ? "bg-gradient-to-br from-blue-200/80 to-blue-300/80 border border-blue-400/50 dark:from-blue-800/80 dark:to-blue-700/80 dark:border-blue-500/30"
                : "bg-gradient-to-br from-blue-200/80 to-blue-300/80 border border-blue-400/50 dark:from-blue-800/80 dark:to-blue-700/80 dark:border-blue-500/30"
            }`}
          >
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-xs sm:text-sm font-medium ${
                      isProfessionalMode ? "text-blue-700 dark:text-blue-200" : "text-blue-600 dark:text-blue-300"
                    }`}
                  >
                    {isProfessionalMode ? "📅" : "☀️"} Para Hoy
                  </p>
                  <p
                    className={`text-xl sm:text-2xl font-bold ${
                      isProfessionalMode ? "text-blue-800 dark:text-blue-100" : "text-blue-800 dark:text-blue-100"
                    }`}
                  >
                    {todayTasks.length}
                  </p>
                </div>
                <Calendar
                  className={`w-6 h-6 sm:w-8 sm:h-8 ${
                    isProfessionalMode ? "text-blue-600 dark:text-blue-400" : "text-blue-500 dark:text-blue-400"
                  }`}
                />
              </div>
            </CardContent>
          </Card>

          <Card
            className={`backdrop-blur-sm shadow-xl rounded-3xl transform hover:scale-105 transition-all duration-300 ${
              isProfessionalMode
                ? "bg-gradient-to-br from-red-200/80 to-red-300/80 border border-red-400/50 dark:from-red-800/80 dark:to-red-700/80 dark:border-red-500/30"
                : "bg-gradient-to-br from-red-200/80 to-red-300/80 border border-red-400/50 dark:from-red-800/80 dark:to-red-700/80 dark:border-red-500/30"
            }`}
          >
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-xs sm:text-sm font-medium ${
                      isProfessionalMode ? "text-red-700 dark:text-red-200" : "text-red-600 dark:text-red-300"
                    }`}
                  >
                    {isProfessionalMode ? "⚠️" : "⚡"} Vencidas
                  </p>
                  <p
                    className={`text-xl sm:text-2xl font-bold ${
                      isProfessionalMode ? "text-red-800 dark:text-red-100" : "text-red-800 dark:text-red-100"
                    }`}
                  >
                    {overdueTasks.length}
                  </p>
                </div>
                <AlertCircle
                  className={`w-6 h-6 sm:w-8 sm:h-8 ${
                    isProfessionalMode ? "text-red-600 dark:text-red-400" : "text-red-500 dark:text-red-400"
                  }`}
                />
              </div>
            </CardContent>
          </Card>

          <Card
            className={`backdrop-blur-sm shadow-xl rounded-3xl transform hover:scale-105 transition-all duration-300 ${
              isProfessionalMode
                ? "bg-gradient-to-br from-emerald-200/80 to-emerald-300/80 border border-emerald-400/50 dark:from-emerald-800/80 dark:to-emerald-700/80 dark:border-emerald-500/30"
                : "bg-gradient-to-br from-teal-200/80 to-teal-300/80 border border-teal-400/50 dark:from-teal-800/80 dark:to-teal-700/80 dark:border-teal-500/30"
            }`}
          >
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-xs sm:text-sm font-medium ${
                      isProfessionalMode ? "text-emerald-700 dark:text-emerald-200" : "text-teal-600 dark:text-teal-300"
                    }`}
                  >
                    {isProfessionalMode ? "✅" : "✅"} Completadas
                  </p>
                  <p
                    className={`text-xl sm:text-2xl font-bold ${
                      isProfessionalMode ? "text-emerald-800 dark:text-emerald-100" : "text-teal-800 dark:text-teal-100"
                    }`}
                  >
                    {completedTasks.length}
                  </p>
                </div>
                <CheckCircle
                  className={`w-6 h-6 sm:w-8 sm:h-8 ${
                    isProfessionalMode ? "text-emerald-600 dark:text-emerald-400" : "text-teal-500 dark:text-teal-400"
                  }`}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Button
          onClick={() => setIsDialogOpen(true)}
          className={`w-full sm:w-auto rounded-full px-6 sm:px-8 py-3 mb-8 shadow-lg transform hover:scale-105 transition-all duration-300 ${
            isProfessionalMode
              ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
              : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          }`}
        >
          <Plus className="w-6 h-6 mr-2" />
          {isProfessionalMode ? "📄 Nueva Tarea" : "✨ Nueva Tarea"}
        </Button>

        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) {
              setEditingTask(null)
              setNewTask({
                title: "",
                description: "",
                dueDate: "",
                dueTime: "",
                priority: "media",
                category: "trabajo",
                completed: false,
              })
            }
          }}
        >
          <DialogContent className="w-[95vw] max-w-md mx-auto max-h-[90vh] overflow-y-auto rounded-3xl border-0 shadow-2xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white p-4 sm:p-6">
            <DialogHeader className="mb-6 text-center">
              <DialogTitle className="text-xl sm:text-2xl font-bold text-purple-700 dark:text-purple-200 mb-2">
                {editingTask ? "🎨 Editar Tarea" : "✨ Crear Nueva Tarea"}
              </DialogTitle>
              <DialogDescription className="text-base text-purple-600 dark:text-purple-300">
                {editingTask ? "📝 Modifica los detalles de tu tarea" : "🌟 Agrega una nueva tarea a tu agenda"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block mb-2 text-sm sm:text-base font-semibold text-purple-700 dark:text-purple-200">
                  💖 Título *
                </label>
                <Input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Nombre de la tarea"
                  required
                  className="w-full rounded-2xl border-purple-300 dark:border-purple-600 bg-purple-50 dark:bg-slate-700 text-gray-900 dark:text-white placeholder-purple-400 dark:placeholder-purple-300 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500 dark:focus:ring-purple-400 text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm sm:text-base font-semibold text-purple-700 dark:text-purple-200">
                  📝 Descripción
                </label>
                <Textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Detalles de la tarea"
                  className="w-full rounded-2xl border-purple-300 dark:border-purple-600 bg-purple-50 dark:bg-slate-700 text-gray-900 dark:text-white placeholder-purple-400 dark:placeholder-purple-300 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500 dark:focus:ring-purple-400 min-h-[80px] text-sm sm:text-base"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm sm:text-base font-semibold text-purple-700 dark:text-purple-200">
                    📅 Fecha
                  </label>
                  <Input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full rounded-2xl border-purple-300 dark:border-purple-600 bg-purple-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500 dark:focus:ring-purple-400 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm sm:text-base font-semibold text-purple-700 dark:text-purple-200">
                    🕐 Hora
                  </label>
                  <Input
                    type="time"
                    value={newTask.dueTime}
                    onChange={(e) => setNewTask({ ...newTask, dueTime: e.target.value })}
                    className="w-full rounded-2xl border-purple-300 dark:border-purple-600 bg-purple-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500 dark:focus:ring-purple-400 text-sm sm:text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm sm:text-base font-semibold text-purple-700 dark:text-purple-200">
                    🎯 Prioridad
                  </label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
                  >
                    <SelectTrigger className="w-full rounded-2xl border-purple-300 dark:border-purple-600 bg-purple-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500 dark:focus:ring-purple-400 text-sm sm:text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-purple-300 dark:border-purple-600 bg-white dark:bg-slate-800">
                      <SelectItem value="alta" className="text-red-600 dark:text-red-400">
                        🔥 Alta
                      </SelectItem>
                      <SelectItem value="media" className="text-yellow-600 dark:text-yellow-400">
                        ⭐ Media
                      </SelectItem>
                      <SelectItem value="baja" className="text-green-600 dark:text-green-400">
                        ✅ Baja
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block mb-2 text-sm sm:text-base font-semibold text-purple-700 dark:text-purple-200">
                    🏷️ Categoría
                  </label>
                  <Select
                    value={newTask.category}
                    onValueChange={(value) => setNewTask({ ...newTask, category: value })}
                  >
                    <SelectTrigger className="w-full rounded-2xl border-purple-300 dark:border-purple-600 bg-purple-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500 dark:focus:ring-purple-400 text-sm sm:text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-purple-300 dark:border-purple-600 bg-white dark:bg-slate-800">
                      <SelectItem value="trabajo" className="text-blue-600 dark:text-blue-400">
                        💼 Trabajo
                      </SelectItem>
                      <SelectItem value="personal" className="text-purple-600 dark:text-purple-400">
                        🏠 Personal
                      </SelectItem>
                      <SelectItem value="estudio" className="text-green-600 dark:text-green-400">
                        📚 Estudio
                      </SelectItem>
                      <SelectItem value="salud" className="text-pink-600 dark:text-pink-400">
                        💪 Salud
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 rounded-full px-6 py-3 shadow-lg transform hover:scale-105 transition-all duration-300 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 dark:from-purple-600 dark:to-pink-600 dark:hover:from-purple-700 dark:hover:to-pink-700 text-white text-sm sm:text-base"
                >
                  ✨ {editingTask ? "Actualizar Tarea" : "Crear Tarea"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="flex-1 sm:flex-none rounded-full px-6 py-3 border-purple-300 dark:border-purple-600 text-purple-700 dark:text-purple-200 hover:bg-purple-50 dark:hover:bg-slate-700 text-sm sm:text-base bg-transparent"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-8 px-2 sm:px-0">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger
              className={`w-full sm:w-48 rounded-full border-2 transition-all duration-300 ${
                isProfessionalMode
                  ? "bg-emerald-50/80 dark:bg-emerald-900/20 border-emerald-200/50 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-200 hover:border-emerald-300 dark:hover:border-emerald-400"
                  : "bg-purple-50/80 dark:bg-purple-900/20 border-purple-200/50 dark:border-purple-500/30 text-purple-800 dark:text-purple-200 hover:border-purple-300 dark:hover:border-purple-400"
              }`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-0 shadow-xl bg-white dark:bg-slate-800">
              <SelectItem value="todas" className="rounded-xl">
                {isProfessionalMode ? "📋" : "📝"} Todas las tareas
              </SelectItem>
              <SelectItem value="trabajo" className="rounded-xl">
                {isProfessionalMode ? "💼" : "💼"} Trabajo
              </SelectItem>
              <SelectItem value="personal" className="rounded-xl">
                {isProfessionalMode ? "👤" : "🏠"} Personal
              </SelectItem>
              <SelectItem value="estudio" className="rounded-xl">
                {isProfessionalMode ? "📚" : "📖"} Estudio
              </SelectItem>
              <SelectItem value="salud" className="rounded-xl">
                {isProfessionalMode ? "⚕️" : "💊"} Salud
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger
              className={`w-full sm:w-48 rounded-full border-2 transition-all duration-300 ${
                isProfessionalMode
                  ? "bg-emerald-50/80 dark:bg-emerald-900/20 border-emerald-200/50 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-200 hover:border-emerald-300 dark:hover:border-emerald-400"
                  : "bg-purple-50/80 dark:bg-purple-900/20 border-purple-200/50 dark:border-purple-500/30 text-purple-800 dark:text-purple-200 hover:border-purple-300 dark:hover:border-purple-400"
              }`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-0 shadow-xl bg-white dark:bg-slate-800">
              <SelectItem value="todas" className="rounded-xl">
                {isProfessionalMode ? "📊" : "🌈"} Todas las prioridades
              </SelectItem>
              <SelectItem value="alta" className="rounded-xl">
                {isProfessionalMode ? "🔴" : "🔥"} Alta
              </SelectItem>
              <SelectItem value="media" className="rounded-xl">
                {isProfessionalMode ? "🟡" : "⭐"} Media
              </SelectItem>
              <SelectItem value="baja" className="rounded-xl">
                {isProfessionalMode ? "🟢" : "🌱"} Baja
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3 sm:space-y-4 px-2 sm:px-0">
          {filteredTasks.length === 0 ? (
            <Card className="backdrop-blur-sm shadow-xl rounded-3xl transition-all duration-300 bg-gradient-to-br from-white/90 to-purple-50/80 border border-purple-200/50 dark:from-slate-800/90 dark:to-slate-700/80 dark:border-purple-500/30">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="text-purple-500 dark:text-purple-300">
                  <div className="text-4xl sm:text-6xl mb-4">📋</div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 text-purple-800 dark:text-purple-200">
                  No hay tareas aún
                </h3>
                <p className="text-sm sm:text-base text-purple-700 dark:text-purple-300">
                  ¡Crea tu primera tarea para comenzar! ✨
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredTasks.map((task) => (
              <Card
                key={task.id}
                className={`backdrop-blur-sm shadow-xl rounded-3xl transition-all hover:shadow-2xl hover:scale-[1.02] duration-300 bg-gradient-to-br from-slate-800/90 border border-purple-500/20 dark:from-slate-800/90 dark:border-purple-500/20 ${task.completed ? "opacity-75" : ""}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id)}
                      className={`mt-1 rounded-full transition-all duration-200 ${
                        isProfessionalMode
                          ? "data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 border-emerald-300 dark:border-emerald-400 dark:data-[state=checked]:bg-emerald-400"
                          : "data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500 border-purple-300 dark:border-purple-400 dark:data-[state=checked]:bg-purple-400"
                      } ${isDarkMode ? "bg-slate-700/50 hover:bg-slate-600/50" : "bg-white/80 hover:bg-gray-50"}`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="mb-3">
                        <h3
                          className={`text-base sm:text-lg font-bold mb-2 ${task.completed ? "line-through text-gray-400" : "text-purple-200 dark:text-white"}`}
                        >
                          {task.title}
                        </h3>
                        {task.description && (
                          <p
                            className={`text-sm mb-3 ${task.completed ? "line-through" : "text-purple-200 dark:text-white"}`}
                          >
                            {task.description}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge className={`${getPriorityColor(task.priority)} rounded-full px-2 py-1 text-xs`}>
                            {getPriorityIcon(task.priority)}
                            <span className="ml-1 capitalize">{task.priority}</span>
                          </Badge>
                          <Badge
                            variant="outline"
                            className="capitalize rounded-full border-purple-500/30 text-purple-200 dark:border-purple-500/30 dark:text-purple-200 px-2 py-1 text-xs"
                          >
                            {task.category}
                          </Badge>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 text-xs sm:text-sm text-purple-200 dark:text-white">
                          {task.dueDate && (
                            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-purple-500/20 dark:bg-purple-200/50 w-fit">
                              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span className="whitespace-nowrap">
                                {new Date(task.dueDate + "T00:00:00").toLocaleDateString("es-ES", {
                                  weekday: "short",
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                          )}
                          {task.dueTime && (
                            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-pink-500/20 dark:bg-pink-200/50 w-fit">
                              <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span className="whitespace-nowrap">{task.dueTime}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEditTask(task)}
                        className="rounded-full text-purple-200 hover:text-purple-300 hover:bg-purple-500/20 dark:text-purple-300 dark:hover:text-purple-200 dark:hover:bg-purple-500/20 p-2"
                      >
                        <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTask(task.id)}
                        className="rounded-full text-pink-200 hover:text-pink-300 hover:bg-pink-500/20 dark:text-pink-300 dark:hover:text-pink-200 dark:hover:bg-pink-500/20 p-2"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
