"use client"

import React, { useEffect, useState } from 'react'
import { api } from '@/services/api'

interface Stat {
  label: string;
  value: string;
  change: string;
  trend: string;
}

export function StatsGrid() {
  const [stats, setStats] = useState<Stat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await api.dashboard.getStats()
        setStats(data.stats || [])
      } catch (err) {
        console.error('Failed to load stats:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const getIconForStat = (index: number) => {
    switch (index) {
      case 0: return { icon: "bx-trending-up", color: "#6366F1", bg: "rgba(99, 102, 241, 0.15)" }
      case 1: return { icon: "bx-heart", color: "#EC4899", bg: "rgba(236, 72, 153, 0.15)" }
      case 2: return { icon: "bx-bot", color: "#06B6D4", bg: "rgba(6, 182, 212, 0.15)" }
      case 3: return { icon: "bx-rocket", color: "#10B981", bg: "rgba(16, 185, 129, 0.15)" }
      default: return { icon: "bx-bar-chart", color: "#8B5CF6", bg: "rgba(139, 92, 246, 0.15)" }
    }
  }

  if (loading) {
    return (
      <div className="stats-grid">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="stat-card animate-pulse" style={{ height: '120px' }}></div>
        ))}
      </div>
    )
  }

  return (
    <div className="stats-grid">
      {stats.map((stat, i) => {
        const iconConfig = getIconForStat(i)
        return (
          <div key={i} className="stat-card">
            <div className="stat-card-row">
              <div className="stat-icon" style={{ background: iconConfig.bg, color: iconConfig.color }}>
                <i className={`bx ${iconConfig.icon}`}></i>
              </div>
              <div className={`stat-change ${stat.trend === 'up' ? 'positive' : 'negative'}`}>
                {stat.trend === 'up' ? <i className="bx bx-up-arrow-alt"></i> : <i className="bx bx-down-arrow-alt"></i>}
                {stat.change}
              </div>
            </div>
            <div className="stat-info">
              <h3 className="stat-value">{stat.value}</h3>
              <p className="stat-label">{stat.label}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
