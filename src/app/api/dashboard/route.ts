import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const userId = request.headers.get("X-User-Id")
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch CRM Data
    const analytics = await prisma.analytics.findFirst({
      where: { userId },
      orderBy: { date: 'desc' }
    })

    const recentCampaigns = await prisma.campaign.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5
    })

    // Formatting stats based on the mockups
    const stats = [
      { 
        label: "Total Reach", 
        value: analytics ? (analytics.reach >= 1000 ? (analytics.reach/1000).toFixed(1) + 'K' : analytics.reach.toString()) : "0", 
        change: "+12.5%",
        trend: "up"
      },
      { 
        label: "Engagement Rate", 
        value: analytics ? analytics.engagementRate.toString() + "%" : "0%", 
        change: "+3.2%",
        trend: "up"
      },
      { 
        label: "AI Generations", 
        value: analytics ? analytics.generations.toString() : "0", 
        change: "+28.4%",
        trend: "up"
      },
      { 
        label: "Active Campaigns", 
        value: analytics ? analytics.activeCampaigns.toString() : "0", 
        change: "+2",
        trend: "up"
      },
    ]

    const quickActions = [
      { icon: "Plus", label: "New Campaign", href: "/ai-studio" },
      { icon: "Upload", label: "Upload File", href: "/documents" },
      { icon: "Settings", label: "Settings", href: "/settings" },
    ]

    // Fetch historical analytics for charts
    const historicalAnalytics = await prisma.analytics.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
      take: 7
    })

    const chartData = historicalAnalytics.map(a => ({
      date: a.date.toLocaleDateString('en-US', { weekday: 'short' }),
      engagement: a.engagementRate,
      revenue: a.revenue,
      reach: a.reach
    }))

    return NextResponse.json({ 
      stats, 
      quickActions,
      chartData,
      recentCampaigns
    })
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
