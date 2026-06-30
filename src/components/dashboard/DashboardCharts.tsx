"use client"

import React, { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { api } from '@/services/api'

interface ChartDataPoint {
  date: string
  engagement: number
  revenue: number
  reach: number
}

export function DashboardCharts() {
  const [data, setData] = useState<ChartDataPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        // The dashboard endpoint is already called by StatsGrid.
        // We could optimize by fetching once in a parent context,
        // but for now we fetch here to keep components decoupled.
        const res = await fetch('/api/dashboard', {
          headers: {
            // We simulate the user ID being passed or handled by the backend session
            // In Next.js App Router, the session is usually handled server-side, 
            // so fetch('/api/dashboard') will use the secure cookie.
          }
        })
        const result = await res.json()
        if (result.chartData) {
          setData(result.chartData)
        }
      } catch (err) {
        console.error('Failed to load chart data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="charts-grid grid grid-cols-2 gap-6 mt-8">
        <div className="chart-card bg-[#111827] border border-[#1f2937] rounded-xl p-6 h-80 animate-pulse"></div>
        <div className="chart-card bg-[#111827] border border-[#1f2937] rounded-xl p-6 h-80 animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="charts-grid grid lg:grid-cols-2 gap-6 mt-8">
      {/* Engagement Chart */}
      <div className="chart-card bg-[#111827] border border-[#1f2937] rounded-xl p-6 shadow-xl">
        <div className="card-header flex justify-between items-center mb-6">
          <h3 className="font-semibold text-lg">Engagement & Reach</h3>
          <select className="chart-filter-select bg-[#1f2937] border border-[#374151] text-sm rounded px-3 py-1 outline-none">
            <option>7 Days</option>
          </select>
        </div>
        <div className="chart-wrapper h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
              <Line type="monotone" dataKey="engagement" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', r: 4 }} activeDot={{ r: 6 }} name="Engagement (%)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="chart-card bg-[#111827] border border-[#1f2937] rounded-xl p-6 shadow-xl">
        <div className="card-header flex justify-between items-center mb-6">
          <h3 className="font-semibold text-lg">Revenue Analytics</h3>
          <select className="chart-filter-select bg-[#1f2937] border border-[#374151] text-sm rounded px-3 py-1 outline-none">
            <option>7 Days</option>
          </select>
        </div>
        <div className="chart-wrapper h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px', color: '#fff' }}
                cursor={{ fill: '#374151', opacity: 0.4 }}
              />
              <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} name="Revenue ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
