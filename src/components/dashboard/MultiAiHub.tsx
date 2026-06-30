"use client"

import React, { useState } from 'react'
import { api } from '@/services/api'

export function MultiAiHub() {
  const [activeModel, setActiveModel] = useState('openai')
  const [contentType, setContentType] = useState('post')
  const [tone, setTone] = useState('professional')
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!prompt) return
    setLoading(true)
    setResult('')
    try {
      const res = await fetch("/api/ai-studio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: activeModel,
          contentType,
          tone,
          platform: 'universal',
          prompt,
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to generate content")
      }

      // Stream the response
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      
      if (reader) {
        let chunk = await reader.read()
        while (!chunk.done) {
          setResult((prev) => (prev || '') + decoder.decode(chunk.value, { stream: true }))
          chunk = await reader.read()
        }
      }
    } catch (error) {
      console.error(error)
      setResult("An error occurred while generating content. Please check your API keys or try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="page active" id="page-ai-studio">
      <div className="page-header">
        <div className="header-title">
          <h1>AI Content Studio</h1>
          <p className="text-gray-400 text-sm mt-1">Produce high-quality content using world-class AI models orchestrated from a single platform.</p>
        </div>
        
        <div className="model-selector-wrapper flex items-center gap-3">
          <label htmlFor="ai-model-select" className="text-sm font-medium text-gray-400">Active Model:</label>
          <select 
            id="ai-model-select" 
            className="bg-[#1f2937] border border-[#374151] text-white rounded-lg px-4 py-2 outline-none focus:border-indigo-500"
            value={activeModel}
            onChange={(e) => setActiveModel(e.target.value)}
          >
            <option value="openai">OpenAI GPT-4o</option>
            <option value="gemini">Google Gemini 1.5 Pro</option>
            <option value="claude">Claude 3.5 Sonnet</option>
            <option value="deepseek">DeepSeek V3</option>
          </select>
        </div>
      </div>

      <div className="studio-layout flex gap-6 mt-6">
        <div className="studio-input flex-1 bg-[#111827] border border-[#1f2937] rounded-xl p-6 flex flex-col gap-6 shadow-xl">
          <div className="input-section">
            <label className="block text-sm font-semibold text-gray-300 mb-3">Content Type</label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'post', icon: 'bx-edit', label: 'Social Post' },
                { id: 'blog', icon: 'bx-file', label: 'Blog Article' },
                { id: 'ad', icon: 'bx-megaphone', label: 'Ad Copy' },
                { id: 'email', icon: 'bx-envelope', label: 'Email Series' },
                { id: 'video', icon: 'bx-video', label: 'Video Script' },
              ].map(type => (
                <button 
                  key={type.id}
                  onClick={() => setContentType(type.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${contentType === type.id ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-[#1f2937] text-gray-400 hover:bg-[#374151] hover:text-white'}`}
                >
                  <i className={`bx ${type.icon}`}></i> {type.label}
                </button>
              ))}
            </div>
          </div>

          <div className="input-section">
            <label className="block text-sm font-semibold text-gray-300 mb-3">Tone of Voice</label>
            <select 
              className="w-full bg-[#1f2937] border border-[#374151] text-white rounded-lg px-4 py-3 outline-none focus:border-indigo-500"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            >
              <option value="professional">Professional & Authoritative</option>
              <option value="conversational">Conversational & Friendly</option>
              <option value="persuasive">Persuasive & Sales-Driven</option>
              <option value="humorous">Humorous & Witty</option>
              <option value="urgent">Urgent & Compelling</option>
            </select>
          </div>

          <div className="input-section flex-1 flex flex-col">
            <label className="block text-sm font-semibold text-gray-300 mb-3">Topic & Context</label>
            <textarea 
              className="w-full flex-1 min-h-[150px] bg-[#1f2937] border border-[#374151] text-white rounded-lg p-4 outline-none focus:border-indigo-500 resize-none placeholder:text-gray-500"
              placeholder="Describe what you want the AI to create in detail..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            ></textarea>
          </div>

          <button 
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 disabled:opacity-70"
            onClick={handleGenerate}
            disabled={loading || !prompt}
          >
            {loading ? <i className="bx bx-loader-alt bx-spin text-xl"></i> : <i className="bx bx-magic-wand text-xl"></i>}
            {loading ? 'Generating Magic...' : 'Generate Content'}
          </button>
        </div>

        <div className="studio-output flex-[1.5] bg-[#111827] border border-[#1f2937] rounded-xl flex flex-col shadow-xl overflow-hidden relative">
          <div className="output-header flex items-center justify-between p-4 border-b border-[#1f2937] bg-[#0d1425]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]"></div>
              <span className="text-sm font-medium text-gray-300">Live Preview</span>
            </div>
            <div className="output-actions flex gap-2">
              <button className="text-gray-400 hover:text-white bg-[#1f2937] hover:bg-[#374151] px-3 py-1.5 rounded text-sm transition-colors flex items-center gap-1">
                <i className="bx bx-copy"></i> Copy
              </button>
              <button className="text-white bg-indigo-500 hover:bg-indigo-600 px-3 py-1.5 rounded text-sm transition-colors flex items-center gap-1 shadow-lg shadow-indigo-500/20">
                <i className="bx bx-export"></i> Export
              </button>
            </div>
          </div>
          <div className="output-body p-8 flex-1 overflow-y-auto text-gray-300 leading-relaxed font-['Inter']">
            {result ? (
              <div className="whitespace-pre-wrap">{result}</div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-4 opacity-50">
                <i className="bx bx-file-blank text-6xl"></i>
                <p>Your generated content will appear here</p>
              </div>
            )}
            
            {loading && !result && (
              <div className="absolute inset-0 bg-[#111827]/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 z-10">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-indigo-400 font-medium animate-pulse">Consulting {activeModel}...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
