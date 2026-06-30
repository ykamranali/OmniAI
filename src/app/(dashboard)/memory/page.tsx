"use client"

import * as React from "react"
import { Search, Plus, Filter, Database, Tag, BrainCircuit, Lightbulb, Target } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { api } from "@/services/api"

export default function MemoryPage() {
  const [memorySections, setMemorySections] = React.useState<any>({})
  const [loading, setLoading] = React.useState(true)
  const [open, setOpen] = React.useState(false)
  const [newSection, setNewSection] = React.useState("projects")
  const [newContent, setNewContent] = React.useState("")

  const loadMemory = async () => {
    try {
      const data = await api.memory.getAll()
      setMemorySections(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    loadMemory()
  }, [])

  const handleAddMemory = async () => {
    if (!newContent) return
    try {
      await api.memory.create(newSection, newContent)
      setNewContent("")
      setOpen(false)
      loadMemory()
    } catch (err) {
      console.error(err)
    }
  }

  const ICONS: Record<string, any> = {
    projects: Database,
    goals: Target,
    skills: BrainCircuit,
    preferences: Filter,
    saved: Tag,
  }

  const LABELS: Record<string, string> = {
    projects: "Active Projects",
    goals: "Goals & Objectives",
    skills: "Skills & Expertise",
    preferences: "Preferences",
    saved: "Saved Snippets",
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agent Memory</h1>
          <p className="text-muted-foreground mt-1">Manage what OmniAI knows about your projects, preferences, and goals.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={16} /> Add Memory Fact
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Memory Fact</DialogTitle>
              <DialogDescription>Store important context that the AI should remember.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={newSection} onValueChange={setNewSection}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="projects">Active Projects</SelectItem>
                    <SelectItem value="goals">Goals & Objectives</SelectItem>
                    <SelectItem value="skills">Skills & Expertise</SelectItem>
                    <SelectItem value="preferences">Preferences</SelectItem>
                    <SelectItem value="saved">Saved Snippets</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Fact / Detail</label>
                <Input 
                  value={newContent} 
                  onChange={e => setNewContent(e.target.value)} 
                  placeholder="E.g., I prefer dark mode in all UI designs." 
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddMemory}>Save Memory</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search memory entities..." className="pl-9 bg-background/50 backdrop-blur-sm" />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="gap-2 flex-1 sm:flex-none"><Filter size={16} /> Filter</Button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-muted-foreground">Loading memory...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4">
          {Object.keys(memorySections).map((sectionKey) => {
            const Icon = ICONS[sectionKey] || Lightbulb
            const items = memorySections[sectionKey] || []
            return (
              <Card key={sectionKey} className="glass flex flex-col">
                <CardHeader className="pb-4 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                      <Icon size={18} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{LABELS[sectionKey] || sectionKey}</CardTitle>
                      <CardDescription>{items.length} items</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 flex-1">
                  <div className="space-y-3">
                    {items.map((item: any) => (
                      <div key={item.id} className="flex items-start gap-3 group">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary/50 mt-2 shrink-0 group-hover:bg-primary transition-colors" />
                        <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
                          {item.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
