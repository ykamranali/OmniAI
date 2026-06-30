"use client";

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useCompletion } from '@ai-sdk/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function AiStudioPage() {
  const [contentType, setContentType] = useState('post');
  const [tone, setTone] = useState('professional');
  const [platform, setPlatform] = useState('none');
  const [model, setModel] = useState('openai');
  const [activeTab, setActiveTab] = useState('generated');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const { completion, input, handleInputChange, handleSubmit, isLoading } = useCompletion({
    api: '/api/ai-studio',
    body: {
      model,
      contentType,
      tone,
      platform
    },
    onFinish: () => {
      toast.success('Content generated successfully!');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to generate content');
    }
  });

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) {
      toast.error('Please enter a prompt before generating.');
      return;
    }
    handleSubmit(e);
  };

  const handleCopy = () => {
    if (completion) {
      navigator.clipboard.writeText(completion);
      toast.success('Copied to clipboard!');
    }
  };

  const handleSchedule = () => {
    toast.success('Opening scheduler for generated content...');
  };

  return (
    <div className="page-container p-8 h-full overflow-y-auto">
      <section id="page-ai-studio" className="page active" style={{ display: 'block' }}>
          <div className="page-header">
            <div className="header-title">
              <h1>AI Content Studio</h1>
              <p>Produce high-quality content using world-class AI models orchestrated from a single platform.</p>
            </div>
            
            <div className="model-selector-wrapper">
              <label>Active Model:</label>
              <select className="btn btn-secondary" value={model} onChange={(e) => setModel(e.target.value)}>
                <option value="openai">OpenAI GPT-4o</option>
                <option value="gemini">Google Gemini 1.5 Pro</option>
                <option value="claude">Claude 3.5 Sonnet</option>
                <option value="deepseek">DeepSeek V3</option>
              </select>
            </div>
          </div>

          <div className="studio-layout">
            {/* Left panel: Form parameters */}
            <div className="studio-input">
              <div className="input-section">
                <label>Content Type</label>
                <div className="btn-group">
                  <button className={`btn btn-option ${contentType === 'post' ? 'active' : ''}`} onClick={() => setContentType('post')}><i className="bx bx-edit"></i> Social Post</button>
                  <button className={`btn btn-option ${contentType === 'blog' ? 'active' : ''}`} onClick={() => setContentType('blog')}><i className="bx bx-file"></i> Blog Article</button>
                  <button className={`btn btn-option ${contentType === 'email' ? 'active' : ''}`} onClick={() => setContentType('email')}><i className="bx bx-envelope"></i> Email Series</button>
                  <button className={`btn btn-option ${contentType === 'video-gen' ? 'active' : ''}`} onClick={() => setContentType('video-gen')}><i className="bx bxs-video"></i> Video Script</button>
                </div>
              </div>

              <div className="input-section">
                <label>Tone of Voice</label>
                <div className="btn-group">
                  <button className={`btn btn-option ${tone === 'professional' ? 'active' : ''}`} onClick={() => setTone('professional')}>Professional</button>
                  <button className={`btn btn-option ${tone === 'casual' ? 'active' : ''}`} onClick={() => setTone('casual')}>Casual</button>
                  <button className={`btn btn-option ${tone === 'humorous' ? 'active' : ''}`} onClick={() => setTone('humorous')}>Humorous</button>
                  <button className={`btn btn-option ${tone === 'inspirational' ? 'active' : ''}`} onClick={() => setTone('inspirational')}>Inspirational</button>
                </div>
              </div>

              <div className="input-section">
                <label>Auto-Publish Target Account</label>
                <select className="form-control-select" value={platform} onChange={(e) => setPlatform(e.target.value)}>
                  <option value="none">Save to Drafts / Do Not Publish</option>
                  <option value="instagram_primary">@OmniAI_Nexus (Instagram)</option>
                  <option value="x_primary">@OmniAINexus (X/Twitter)</option>
                  <option value="multi_post">Publish to All Connected Accounts</option>
                </select>
              </div>

              <form onSubmit={handleGenerate}>
                <div className="input-section">
                  <div className="prompt-header-row">
                    <label>Brief Prompt & Requirements</label>
                    <span>{input.length} / 1000</span>
                  </div>
                  <textarea 
                    placeholder="E.g., Write a promotional post for a web automation startup..." 
                    rows={6} 
                    maxLength={1000}
                    value={input}
                    onChange={handleInputChange}
                  ></textarea>
                </div>

              <div className="advanced-toggle" onClick={() => setShowAdvanced(!showAdvanced)} style={{ cursor: 'pointer' }}>
                <i className={`bx ${showAdvanced ? 'bx-chevron-up' : 'bx-chevron-down'}`}></i> Advanced Generation Settings
              </div>
              
              {showAdvanced && (
                <div className="advanced-options" style={{ display: 'block', marginTop: '1rem' }}>
                  <div className="advanced-grid">
                    <div className="adv-group">
                      <label>Language</label>
                      <select className="form-control-select-sm" defaultValue="en">
                        <option value="en">English (US)</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                      </select>
                    </div>
                    <div className="adv-group">
                      <div className="slider-header">
                        <label>Max Length</label>
                        <span>500 tokens</span>
                      </div>
                      <input type="range" min="50" max="2000" step="50" defaultValue="500" />
                    </div>
                  </div>

                  <div className="adv-checkboxes">
                    <label className="checkbox-container">
                      <input type="checkbox" defaultChecked />
                      <span className="checkmark"></span>
                      Include Hashtags
                    </label>
                    <label className="checkbox-container">
                      <input type="checkbox" defaultChecked />
                      <span className="checkmark"></span>
                      Include Emojis
                    </label>
                    <label className="checkbox-container">
                      <input type="checkbox" defaultChecked />
                      <span className="checkmark"></span>
                      Add CTA
                    </label>
                  </div>
                </div>
              )}

              <button type="submit" className="btn btn-primary btn-full btn-large" disabled={isLoading}>
                {isLoading ? <><i className="bx bx-loader-alt bx-spin"></i> Generating...</> : <><i className="bx bx-wand"></i> Generate Content</>}
              </button>
              </form>
            </div>

            {/* Right panel: Content outputs */}
            <div className="studio-output">
              <div className="output-header">
                <div className="output-tabs">
                  <button className={`output-tab ${activeTab === 'generated' ? 'active' : ''}`} onClick={() => setActiveTab('generated')}>Generated Output</button>
                  <button className={`output-tab ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>History</button>
                </div>
                {completion && (
                  <button className="btn btn-secondary btn-sm" title="Copy Content" onClick={handleCopy}>
                    <i className="bx bx-copy"></i>
                  </button>
                )}
              </div>

              <div className="output-body-container">
                {!completion ? (
                  <div className="output-placeholder">
                    <i className="bx bx-bot"></i>
                    <h3>Your AI Assistant is Ready</h3>
                    <p>Configure the left panel, add a descriptive prompt, and click "Generate Content" to spawn copy dynamically.</p>
                  </div>
                ) : (
                  <div className="output-rich-text prose prose-invert max-w-none" style={{ padding: '1rem', color: '#CBD5E1', fontSize: '0.95rem', lineHeight: 1.6 }}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{completion}</ReactMarkdown>
                  </div>
                )}
              </div>

              {completion && (
                <div className="output-actions">
                  <button className="btn btn-secondary btn-sm" onClick={handleCopy}><i className="bx bx-copy"></i> Copy</button>
                  <button className="btn btn-secondary btn-sm"><i className="bx bx-edit"></i> Edit</button>
                  <button className="btn btn-secondary btn-sm" onClick={handleGenerate}><i className="bx bx-refresh"></i> Regenerate</button>
                  <button className="btn btn-primary btn-sm" onClick={handleSchedule}><i className="bx bx-calendar"></i> Schedule Post</button>
                </div>
              )}
            </div>
          </div>
        </section>
    </div>
  );
}
