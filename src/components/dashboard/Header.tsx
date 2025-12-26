'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu as MenuIcon, Bell, Search, User, X, Settings, LogOut, CreditCard, TrendingUp, AlertCircle } from 'lucide-react'
import { Menu, Transition } from '@headlessui/react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'
import Link from 'next/link'

interface HeaderProps {
  onMenuClick: () => void
  title?: string
}

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success'
  time: string
  read: boolean
}

const initialNotifications: Notification[] = [
  {
    id: '1',
    title: 'Budget Alert',
    message: 'You have used 80% of your Food budget this month.',
    type: 'warning',
    time: '5 min ago',
    read: false,
  },
  {
    id: '2',
    title: 'Goal Progress',
    message: 'Great job! Your "Emergency Fund" goal is 75% complete.',
    type: 'success',
    time: '1 hour ago',
    read: false,
  },
  {
    id: '3',
    title: 'New Transaction',
    message: 'A new expense of ₹2,500 was recorded.',
    type: 'info',
    time: '3 hours ago',
    read: true,
  },
]

const notificationIcons = {
  info: CreditCard,
  warning: AlertCircle,
  success: TrendingUp,
}

const notificationColors = {
  info: 'text-blue-500 bg-blue-500/10',
  warning: 'text-orange-500 bg-orange-500/10',
  success: 'text-green-500 bg-green-500/10',
}

export function Header({ onMenuClick, title = "Dashboard" }: HeaderProps) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  
  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6"
    >
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
      >
        <MenuIcon className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>

      {/* Page title */}
      <div className="flex-1">
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      </div>

      {/* Search */}
      <div className="hidden md:flex items-center space-x-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search transactions..."
            className={cn(
              "w-64 pl-10 pr-4 py-2 text-sm rounded-lg border border-input",
              "bg-background text-foreground placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            )}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2">
        {/* Notifications Dropdown */}
        <Menu as="div" className="relative">
          <Menu.Button as={React.Fragment}>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive rounded-full text-[10px] text-white flex items-center justify-center font-medium">
                  {unreadCount}
                </span>
              )}
            </Button>
          </Menu.Button>

          <Transition
            as={React.Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-80 origin-top-right rounded-lg border border-border bg-background shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="p-3 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-primary hover:underline"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    No notifications
                  </div>
                ) : (
                  notifications.map((notification) => {
                    const Icon = notificationIcons[notification.type]
                    return (
                      <Menu.Item key={notification.id}>
                        {({ active }) => (
                          <div
                            className={cn(
                              "flex items-start gap-3 p-3 cursor-pointer",
                              active && "bg-accent",
                              !notification.read && "bg-primary/5"
                            )}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className={cn("p-2 rounded-full", notificationColors[notification.type])}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={cn(
                                "text-sm text-foreground",
                                !notification.read && "font-medium"
                              )}>
                                {notification.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {notification.time}
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                dismissNotification(notification.id)
                              }}
                              className="p-1 hover:bg-accent rounded text-muted-foreground hover:text-foreground"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </Menu.Item>
                    )
                  })
                )}
              </div>
              {notifications.length > 0 && (
                <div className="p-2 border-t border-border">
                  <Link
                    href="/settings"
                    className="block w-full text-center text-sm text-primary hover:underline py-1"
                  >
                    View all notifications
                  </Link>
                </div>
              )}
            </Menu.Items>
          </Transition>
        </Menu>

        {/* Profile Dropdown */}
        <Menu as="div" className="relative">
          <Menu.Button as={React.Fragment}>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">User menu</span>
            </Button>
          </Menu.Button>

          <Transition
            as={React.Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg border border-border bg-background shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="p-3 border-b border-border">
                <p className="font-medium text-foreground">Guest User</p>
                <p className="text-sm text-muted-foreground">guest@example.com</p>
              </div>
              <div className="p-1">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/settings"
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 text-sm rounded-md",
                        active ? "bg-accent text-accent-foreground" : "text-foreground"
                      )}
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/transactions"
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 text-sm rounded-md",
                        active ? "bg-accent text-accent-foreground" : "text-foreground"
                      )}
                    >
                      <CreditCard className="h-4 w-4" />
                      My Transactions
                    </Link>
                  )}
                </Menu.Item>
              </div>
              <div className="p-1 border-t border-border">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={cn(
                        "flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md text-destructive",
                        active && "bg-destructive/10"
                      )}
                      onClick={() => {
                        // Sign out logic would go here
                        alert('Sign out functionality will be implemented with authentication.')
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </motion.header>
  )
}
