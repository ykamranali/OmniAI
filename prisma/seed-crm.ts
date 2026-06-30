import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Find the first user or create one
  let user = await prisma.user.findFirst()
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: 'Kamran Ahmad',
        email: 'kamran@omniai.nexus',
      }
    })
  }

  const userId = user.id

  console.log(`Seeding CRM data for user: ${user.name} (${userId})`)

  // Clear existing CRM data to prevent duplicates on multiple runs
  await prisma.analytics.deleteMany({ where: { userId } })
  await prisma.socialAccount.deleteMany({ where: { userId } })
  await prisma.campaign.deleteMany({ where: { userId } })

  // 1. Seed Social Accounts
  await prisma.socialAccount.createMany({
    data: [
      {
        userId,
        platform: 'youtube',
        handle: '@OmniAI_Channel',
        status: 'Active',
        followers: 124000,
        posts: 342,
        autoPublish: true,
      },
      {
        userId,
        platform: 'instagram',
        handle: '@omniai.nexus',
        status: 'Active',
        followers: 89200,
        posts: 567,
        autoPublish: true,
      },
      {
        userId,
        platform: 'twitter',
        handle: '@OmniAINexus',
        status: 'Active',
        followers: 45800,
        posts: 1200,
        autoPublish: false,
      },
      {
        userId,
        platform: 'linkedin',
        handle: 'OmniAI Nexus',
        status: 'Active',
        followers: 32100,
        posts: 210,
        autoPublish: true,
      }
    ]
  })

  // 2. Seed Campaigns (Recent Activity)
  await prisma.campaign.createMany({
    data: [
      {
        userId,
        name: 'Instagram Carousel Content',
        type: 'Post',
        model: 'OpenAI GPT-4o',
        platform: 'instagram',
        status: 'success',
        timeAgo: '2 mins ago'
      },
      {
        userId,
        name: 'Nurture Sequence: Summer Sale',
        type: 'Email',
        model: 'Google Gemini',
        platform: 'universal',
        status: 'success',
        timeAgo: '15 mins ago'
      },
      {
        userId,
        name: 'Facebook High-Conversion Ad',
        type: 'Ad Copy',
        model: 'Claude 3.5 Sonnet',
        platform: 'facebook',
        status: 'success',
        timeAgo: '1 hour ago'
      },
      {
        userId,
        name: 'TikTok Viral Product Reel Script',
        type: 'Video',
        model: 'DeepSeek V3',
        platform: 'tiktok',
        status: 'pending',
        timeAgo: '2 hours ago'
      },
      {
        userId,
        name: 'SEO Blog: Modern Web Performance',
        type: 'Blog',
        model: 'Claude 3.5 Sonnet',
        platform: 'universal',
        status: 'success',
        timeAgo: '3 hours ago'
      }
    ]
  })

  // 3. Seed Analytics (for today's dashboard)
  // Let's create an analytics record for today representing the stats in the mockup
  await prisma.analytics.create({
    data: {
      userId,
      date: new Date(),
      reach: 12500,
      engagementRate: 3.2,
      generations: 284,
      activeCampaigns: 12,
      revenue: 4500.00
    }
  })

  console.log('CRM Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
