"use client"

import * as React from "react"
import { Edit, Briefcase, Award, Code, Globe, Mail, Save, X } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

interface UserProfile {
  id: string
  name: string
  email: string
  avatar: string | null
  bio: string | null
}

export default function ProfilePage() {
  const [profile, setProfile] = React.useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  
  // Edit states
  const [editName, setEditName] = React.useState("")
  const [editBio, setEditBio] = React.useState("")
  const [editAvatar, setEditAvatar] = React.useState("")

  React.useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/auth/me")
      if (res.ok) {
        const data = await res.json()
        setProfile(data)
        setEditName(data.name || "")
        setEditBio(data.bio || "")
        setEditAvatar(data.avatar || "")
      }
    } catch (error) {
      console.error("Failed to load profile", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          bio: editBio,
          avatar: editAvatar || null
        })
      })
      if (res.ok) {
        const updated = await res.json()
        setProfile(updated)
        setIsEditing(false)
        // trigger a refresh so other components (like sidebar) pick up the change
        window.dispatchEvent(new Event('profileUpdated'))
      }
    } catch (error) {
      console.error("Failed to update profile", error)
    }
  }

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading profile...</div>
  if (!profile) return <div className="p-8 text-center text-red-500">Failed to load profile.</div>

  return (
    <div className="max-w-4xl mx-auto w-full pb-10 space-y-6">
      {/* Profile Header */}
      <Card className="glass overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary to-accent-purple opacity-80" />
        <CardContent className="relative px-6 pt-0 pb-6 sm:px-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 mb-6">
            <div className="flex items-end gap-4">
              <div className="h-24 w-24 rounded-xl bg-card border-4 border-background flex items-center justify-center text-3xl font-bold shadow-sm overflow-hidden">
                <img src={profile.avatar || "https://github.com/shadcn.png"} alt="Profile" className="h-full w-full object-cover" />
              </div>
              <div className="pb-1 flex-1">
                {isEditing ? (
                  <div className="space-y-2 mt-2 w-full max-w-xs">
                    <Input value={editName} onChange={e => setEditName(e.target.value)} placeholder="Full Name" className="font-bold text-lg h-8" />
                    <Input value={editAvatar} onChange={e => setEditAvatar(e.target.value)} placeholder="Avatar URL (Optional)" className="text-sm h-8" />
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold tracking-tight">{profile.name}</h1>
                    <p className="text-muted-foreground flex items-center gap-1 mt-1 text-sm">
                      <Briefcase size={14} /> OmniAI User
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="shrink-0 flex gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}><X size={16} className="mr-1"/> Cancel</Button>
                  <Button size="sm" onClick={handleSave}><Save size={16} className="mr-1"/> Save</Button>
                </>
              ) : (
                <Button className="gap-2 shrink-0" onClick={() => setIsEditing(true)}><Edit size={16} /> Edit Profile</Button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground border-t pt-6 mt-6">
            <div className="flex items-center gap-1.5 hover:text-foreground transition-colors"><Mail size={16} /> {profile.email}</div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 md:col-span-1">
          <Card className="glass">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><Code size={18} /> Skills</h3>
              <div className="flex flex-wrap gap-2">
                {["React", "Next.js", "AI Integration", "Prompt Engineering"].map(skill => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><Award size={18} /> Achievements</h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                    <Code size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Early Adopter</h4>
                    <p className="text-xs text-muted-foreground">OmniAI Agent</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6 md:col-span-2">
          <Card className="glass h-full">
            <CardContent className="p-6 h-full">
              <h3 className="font-semibold mb-4">About</h3>
              {isEditing ? (
                <textarea 
                  className="w-full min-h-[150px] p-3 rounded-md border bg-transparent text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary"
                  value={editBio} 
                  onChange={e => setEditBio(e.target.value)} 
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {profile.bio || "No bio added yet. Click 'Edit Profile' to tell us about yourself!"}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

