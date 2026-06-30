"use client";

import React from 'react';
import toast from 'react-hot-toast';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AnalyticsPage() {
  
  const audienceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Total Audience',
      data: [0, 0, 0, 0, 0, 0],
      borderColor: '#6366F1',
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      borderWidth: 2,
      fill: true,
      tension: 0.4
    }]
  };

  const contentData = {
    labels: ['Images', 'Video', 'Text Posts', 'Links'],
    datasets: [{
      label: 'Engagement Rate',
      data: [0, 0, 0, 0],
      backgroundColor: ['#6366F1', '#EC4899', '#06B6D4', '#10B981'],
    }]
  };

  const trafficData = {
    labels: ['Direct', 'Social', 'Referral', 'Organic'],
    datasets: [{
      data: [0, 0, 0, 0],
      backgroundColor: ['#6366F1', '#EC4899', '#06B6D4', '#10B981'],
      borderWidth: 0,
    }]
  };

  const platformData = {
    labels: ['Instagram', 'LinkedIn', 'Twitter', 'TikTok', 'Facebook'],
    datasets: [{
      label: 'Clicks',
      data: [0, 0, 0, 0, 0],
      backgroundColor: '#06B6D4',
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
  
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' as const, labels: { color: '#94A3B8' } }
    },
  };

  return (
    <div className="page-container p-8 h-full overflow-y-auto">
      <section id="page-analytics" className="page active" style={{ display: 'block' }}>
          <div className="page-header">
            <div className="header-title">
              <h1>Analytics & Real-time Insights</h1>
              <p>Analyze performance metrics across your channels, with predictive trends computed in real-time.</p>
            </div>
            
            <div className="date-range-picker">
              <input type="date" id="analytics-date-start" defaultValue="2026-05-01" />
              <span>to</span>
              <input type="date" id="analytics-date-end" defaultValue="2026-05-29" />
              <button 
                className="btn btn-secondary btn-sm" 
                onClick={() => toast.success('Filters applied successfully!')}
              >
                Apply
              </button>
            </div>
          </div>

          {/* Metrics overview cards - Empty States */}
          <div className="metrics-grid">
            <div className="metric-card">
              <span className="metric-label">Total Impressions</span>
              <h3 className="metric-value">0</h3>
              <span className="metric-trend" style={{ color: '#94A3B8' }}>0%</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Click-Through Rate (CTR)</span>
              <h3 className="metric-value">0%</h3>
              <span className="metric-trend" style={{ color: '#94A3B8' }}>0%</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Conversion Rate</span>
              <h3 className="metric-value">0%</h3>
              <span className="metric-trend" style={{ color: '#94A3B8' }}>0%</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Avg. Cost per Lead (CPL)</span>
              <h3 className="metric-value">$0.00</h3>
              <span className="metric-trend" style={{ color: '#94A3B8' }}>0%</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Customer Lifetime Value (LTV)</span>
              <h3 className="metric-value">$0</h3>
              <span className="metric-trend" style={{ color: '#94A3B8' }}>0%</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Return on Ad Spend (ROAS)</span>
              <h3 className="metric-value">0x</h3>
              <span className="metric-trend" style={{ color: '#94A3B8' }}>0x</span>
            </div>
          </div>

          {/* Advanced Analytics Charts - Empty Overlays */}
          <div className="charts-grid">
            <div className="chart-card">
              <div className="card-header">
                <h3>Audience Growth Over Time</h3>
              </div>
              <div className="chart-wrapper relative">
                <div className="absolute inset-0 flex items-center justify-center z-10" style={{ background: 'rgba(26, 35, 58, 0.7)', backdropFilter: 'blur(2px)' }}>
                  <p style={{ color: '#94A3B8' }}>No audience data available</p>
                </div>
                <Line data={audienceData} options={chartOptions} />
              </div>
            </div>

            <div className="chart-card">
              <div className="card-header">
                <h3>Content Performance Distribution</h3>
              </div>
              <div className="chart-wrapper relative">
                <div className="absolute inset-0 flex items-center justify-center z-10" style={{ background: 'rgba(26, 35, 58, 0.7)', backdropFilter: 'blur(2px)' }}>
                  <p style={{ color: '#94A3B8' }}>Publish content to see performance</p>
                </div>
                <Bar data={contentData} options={chartOptions} />
              </div>
            </div>
          </div>

          <div className="charts-grid">
            <div className="chart-card">
              <div className="card-header">
                <h3>Traffic Referrals (Doughnut)</h3>
              </div>
              <div className="chart-wrapper relative">
                <div className="absolute inset-0 flex items-center justify-center z-10" style={{ background: 'rgba(26, 35, 58, 0.7)', backdropFilter: 'blur(2px)' }}>
                  <p style={{ color: '#94A3B8' }}>No traffic data available</p>
                </div>
                <Doughnut data={trafficData} options={pieOptions} />
              </div>
            </div>

            <div className="chart-card">
              <div className="card-header">
                <h3>Platform Specific Click Volumes</h3>
              </div>
              <div className="chart-wrapper relative">
                <div className="absolute inset-0 flex items-center justify-center z-10" style={{ background: 'rgba(26, 35, 58, 0.7)', backdropFilter: 'blur(2px)' }}>
                  <p style={{ color: '#94A3B8' }}>Connect platforms to track clicks</p>
                </div>
                <Bar data={platformData} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* AI-powered insights report panel - Empty State */}
          <div className="insights-panel">
            <div className="insights-panel-header">
              <h3><i className="bx bx-bot"></i> AI-Powered Analytics Reports</h3>
              <span className="badge" style={{ background: 'rgba(255,255,255,0.1)', color: '#94A3B8' }}>Awaiting Data</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center', opacity: 0.6 }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <i className="bx bx-brain" style={{ fontSize: '2rem', color: '#94A3B8' }}></i>
                </div>
                <h4 style={{ color: '#F1F5F9', marginBottom: '0.5rem', fontSize: '1.2rem' }}>AI Insights Engine Standby</h4>
                <p style={{ color: '#94A3B8', fontSize: '0.95rem', maxWidth: '600px' }}>OmniAI will automatically generate actionable insights and optimization strategies here once enough campaign and audience data has been collected.</p>
            </div>
          </div>
        </section>
    </div>
  );
}
