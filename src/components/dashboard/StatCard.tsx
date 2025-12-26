'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { cn } from '@/utils/cn'
import { formatCurrency, formatPercentage } from '@/utils/formatters'

interface StatCardProps {
  title: string
  value: number
  change?: number
  changeType?: 'increase' | 'decrease'
  icon: LucideIcon
  color?: string
  format?: 'currency' | 'percentage' | 'number'
  className?: string
}

export function StatCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  color = 'hsl(var(--primary))',
  format = 'currency',
  className
}: StatCardProps) {
  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return formatCurrency(val)
      case 'percentage':
        return formatPercentage(val)
      case 'number':
        return val.toLocaleString()
      default:
        return val.toString()
    }
  }

  const getChangeColor = () => {
    if (!change) return 'text-muted-foreground'
    return changeType === 'increase' 
      ? 'text-success' 
      : 'text-destructive'
  }

  const getChangeIcon = () => {
    if (!change) return null
    return changeType === 'increase' ? '↗' : '↘'
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className={className}
    >
      <Card className="relative overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                {title}
              </p>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-2xl font-bold text-foreground"
              >
                {formatValue(value)}
              </motion.p>
              {change !== undefined && (
                <motion.p
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className={cn("text-sm flex items-center", getChangeColor())}
                >
                  <span className="mr-1">{getChangeIcon()}</span>
                  {Math.abs(change)}% from last month
                </motion.p>
              )}
            </div>
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="p-3 rounded-full"
              style={{ backgroundColor: `${color}20` }}
            >
              <Icon 
                className="h-6 w-6" 
                style={{ color }} 
              />
            </motion.div>
          </div>
          
          {/* Decorative gradient */}
          <div 
            className="absolute top-0 right-0 w-20 h-20 opacity-10 rounded-full blur-xl"
            style={{ backgroundColor: color }}
          />
        </CardContent>
      </Card>
    </motion.div>
  )
}
