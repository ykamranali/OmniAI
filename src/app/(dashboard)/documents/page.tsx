"use client"

import * as React from "react"
import { Search, Plus, FileText, UploadCloud, MoreVertical, FileCode2, FileImage, FileArchive } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/services/api"

export default function DocumentsPage() {
  const [documents, setDocuments] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  const loadDocuments = async () => {
    try {
      const data = await api.documents.getAll()
      setDocuments(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    loadDocuments()
  }, [])

  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // In a real app, you would upload the file to cloud storage here (like S3/Supabase Storage)
    // For now, we simulate the upload and just save the metadata to our database
    const extension = file.name.split('.').pop() || "txt"
    const sizeMb = (file.size / (1024 * 1024)).toFixed(2)
    const sizeStr = parseFloat(sizeMb) < 0.1 ? `${(file.size / 1024).toFixed(0)} KB` : `${sizeMb} MB`

    try {
      setLoading(true)
      await api.documents.create(file.name, extension, sizeStr)
      await loadDocuments()
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf": return <FileText className="text-red-500" />
      case "docx": return <FileText className="text-blue-500" />
      case "md": case "txt": return <FileText className="text-muted-foreground" />
      case "csv": case "xlsx": return <FileText className="text-green-500" />
      case "json": case "ts": case "tsx": return <FileCode2 className="text-yellow-500" />
      case "png": case "jpg": return <FileImage className="text-purple-500" />
      case "zip": return <FileArchive className="text-orange-500" />
      default: return <FileText className="text-muted-foreground" />
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground mt-1">Manage files that your AI agents can read and analyze.</p>
        </div>
      </div>

      <Card className="glass border-dashed border-2 bg-card/30 hover:bg-card/50 transition-colors">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="p-4 rounded-full bg-primary/10 text-primary mb-4">
            <UploadCloud size={32} />
          </div>
          <h3 className="text-xl font-semibold mb-2">Upload Files</h3>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Drag and drop your files here, or click to browse. Supported formats: PDF, DOCX, TXT, CSV, MD.
          </p>
          <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
          />
          <Button className="gap-2 px-8" onClick={() => fileInputRef.current?.click()}>
            <Plus size={16} /> Choose Files
          </Button>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 items-center mt-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search documents..." className="pl-9 bg-background/50 backdrop-blur-sm" />
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-muted-foreground">Loading documents...</div>
      ) : (
        <div className="rounded-xl border bg-card/50 glass overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 border-b text-sm font-medium text-muted-foreground bg-muted/50">
            <div className="col-span-6 sm:col-span-5">Name</div>
            <div className="col-span-3 hidden sm:block">Date Added</div>
            <div className="col-span-3 hidden sm:block">Size</div>
            <div className="col-span-6 sm:col-span-1 text-right">Action</div>
          </div>
          
          <div className="divide-y divide-border/50">
            {documents.map((doc) => (
              <div key={doc.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-accent/50 transition-colors group cursor-pointer">
                <div className="col-span-6 sm:col-span-5 flex items-center gap-3 overflow-hidden">
                  <div className="shrink-0 p-2 rounded-lg bg-background">
                    {getFileIcon(doc.type)}
                  </div>
                  <div className="truncate font-medium">{doc.name}</div>
                </div>
                <div className="col-span-3 hidden sm:block text-sm text-muted-foreground">
                  {new Date(doc.createdAt).toLocaleDateString()}
                </div>
                <div className="col-span-3 hidden sm:block text-sm text-muted-foreground">
                  {doc.size}
                </div>
                <div className="col-span-6 sm:col-span-1 flex justify-end">
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical size={16} />
                  </Button>
                </div>
              </div>
            ))}
            {documents.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                No documents found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
