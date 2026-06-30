"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function DashboardPage() {
  const router = useRouter();

  // Empty Chart Data
  const engagementData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Engagement Rate %',
      data: [0, 0, 0, 0, 0, 0, 0],
      borderColor: '#6366F1',
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      borderWidth: 2,
      fill: true,
      tension: 0.4
    }]
  };

  const revenueData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      label: 'Revenue ($)',
      data: [0, 0, 0, 0],
      backgroundColor: '#10B981',
      borderRadius: 4
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94A3B8' } },
      x: { grid: { display: false }, ticks: { color: '#94A3B8' } }
    }
  };

  return (
    <div className="page-container p-8 h-full overflow-y-auto">
      <section id="page-dashboard" className="page active" style={{ display: 'block' }}>
          <div className="page-header">
            <div className="header-title">
              <h1 id="dashboard-welcome">Welcome back, Kamran</h1>
              <p>Here's what is happening with your automation campaigns today.</p>
              <div className="current-date-badge">
                <i className="bx bx-calendar"></i> <span id="current-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>
            <button className="btn btn-primary" onClick={() => router.push('/campaigns')}>
              <i className="bx bx-plus"></i> New Campaign
            </button>
          </div>

          {/* Stats Widgets Grid (Empty Data) */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-row">
                <div className="stat-icon" style={{"background":"rgba(99, 102, 241, 0.15)","color":"#6366F1"}}>
                  <i className="bx bx-trending-up"></i>
                </div>
                <div className="stat-change" style={{ color: '#94A3B8', background: 'rgba(255,255,255,0.05)' }}>
                  0%
                </div>
              </div>
              <div className="stat-info">
                <h3 className="stat-value">0</h3>
                <p className="stat-label">Total Reach</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-row">
                <div className="stat-icon" style={{"background":"rgba(236, 72, 153, 0.15)","color":"#EC4899"}}>
                  <i className="bx bx-heart"></i>
                </div>
                <div className="stat-change" style={{ color: '#94A3B8', background: 'rgba(255,255,255,0.05)' }}>
                  0%
                </div>
              </div>
              <div className="stat-info">
                <h3 className="stat-value">0%</h3>
                <p className="stat-label">Engagement Rate</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-row">
                <div className="stat-icon" style={{"background":"rgba(6, 182, 212, 0.15)","color":"#06B6D4"}}>
                  <i className="bx bx-bot"></i>
                </div>
                <div className="stat-change" style={{ color: '#94A3B8', background: 'rgba(255,255,255,0.05)' }}>
                  0%
                </div>
              </div>
              <div className="stat-info">
                <h3 className="stat-value">0</h3>
                <p className="stat-label">AI Generations</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-row">
                <div className="stat-icon" style={{"background":"rgba(16, 185, 129, 0.15)","color":"#10B981"}}>
                  <i className="bx bx-rocket"></i>
                </div>
                <div className="stat-change" style={{ color: '#94A3B8', background: 'rgba(255,255,255,0.05)' }}>
                  0
                </div>
              </div>
              <div className="stat-info">
                <h3 className="stat-value">0</h3>
                <p className="stat-label">Active Campaigns</p>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="charts-grid">
            <div className="chart-card">
              <div className="card-header">
                <h3>Engagement Overview</h3>
                <select className="chart-filter-select">
                  <option>7 Days</option>
                  <option>30 Days</option>
                  <option>90 Days</option>
                </select>
              </div>
              <div className="chart-wrapper relative">
                <div className="absolute inset-0 flex items-center justify-center z-10" style={{ background: 'rgba(26, 35, 58, 0.7)', backdropFilter: 'blur(2px)' }}>
                  <div style={{ textAlign: 'center' }}>
                    <i className="bx bx-line-chart" style={{ fontSize: '2rem', color: '#6366F1', marginBottom: '0.5rem' }}></i>
                    <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>No data to display yet</p>
                  </div>
                </div>
                <Line data={engagementData} options={chartOptions} />
              </div>
            </div>

            <div className="chart-card">
              <div className="card-header">
                <h3>Revenue Analytics</h3>
                <select className="chart-filter-select">
                  <option>30 Days</option>
                  <option>90 Days</option>
                  <option>12 Months</option>
                </select>
              </div>
              <div className="chart-wrapper relative">
                <div className="absolute inset-0 flex items-center justify-center z-10" style={{ background: 'rgba(26, 35, 58, 0.7)', backdropFilter: 'blur(2px)' }}>
                  <div style={{ textAlign: 'center' }}>
                    <i className="bx bx-bar-chart" style={{ fontSize: '2rem', color: '#10B981', marginBottom: '0.5rem' }}></i>
                    <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Awaiting campaign data</p>
                  </div>
                </div>
                <Bar data={revenueData} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Bottom Columns */}
          <div className="bottom-grid">
            {/* Recent activity list - Empty State */}
            <div className="activity-card" style={{ minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
              <div className="card-header">
                <h3>Recent AI Generations</h3>
                <Link href="/ai-studio" className="card-link-btn">Create Content</Link>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center', opacity: 0.6 }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <i className="bx bx-bot" style={{ fontSize: '1.5rem', color: '#94A3B8' }}></i>
                </div>
                <h4 style={{ color: '#F1F5F9', marginBottom: '0.5rem', fontSize: '1rem' }}>No AI Generations Yet</h4>
                <p style={{ color: '#94A3B8', fontSize: '0.85rem', maxWidth: '80%' }}>Head over to the AI Studio to generate your first piece of content.</p>
              </div>
            </div>

            {/* Intelligent Recommendations - Empty State */}
            <div className="recommendations-card" style={{ minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
              <div className="card-header">
                <h3>AI-Powered Insights</h3>
                <i className="bx bx-bulb recommendation-sparkle-icon"></i>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center', opacity: 0.6 }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <i className="bx bx-brain" style={{ fontSize: '1.5rem', color: '#94A3B8' }}></i>
                </div>
                <h4 style={{ color: '#F1F5F9', marginBottom: '0.5rem', fontSize: '1rem' }}>Collecting Data</h4>
                <p style={{ color: '#94A3B8', fontSize: '0.85rem', maxWidth: '80%' }}>Connect your social accounts and run campaigns for AI insights.</p>
              </div>
            </div>
          </div>
        </section>
    </div>
  );
}
