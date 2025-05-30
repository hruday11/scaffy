'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { z } from 'zod';
import { createZipFromFiles } from '@/utils/zipUtils';
import type { GenerateApiResponse, BackendStructure } from '@/types/api';
import { generateProjectFiles } from '@/lib/codeGenerator';

const promptSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
});

type PromptFormData = z.infer<typeof promptSchema>;

export default function PromptForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [structure, setStructure] = useState<BackendStructure | null>(null);

  const handleDownload = async () => {
    if (!structure) return;

    try {
      const files = await generateProjectFiles(structure);
      const zipBlob = await createZipFromFiles(files);
      
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'generated-backend.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Project downloaded successfully!');
    } catch (error) {
      console.error('Error generating project:', error);
      toast.error('Failed to generate project files');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStructure(null);

    try {
      const validatedData = promptSchema.parse({ prompt });
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate backend structure');
      }

      const data: GenerateApiResponse = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setStructure(data.structure);
      toast.success('Backend structure generated successfully!');
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Something went wrong');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyber-black to-cyber-darker">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-cyber-primary to-cyber-secondary bg-clip-text text-transparent">
            Scaffy Backend Generator
          </h1>
          <p className="text-xl text-cyber-text-secondary mb-12 max-w-3xl mx-auto">
            Generate production-ready backend code in seconds, not days. Transform your ideas into scalable infrastructure.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
            <div className="cyber-card p-6 text-center">
              <div className="stats-value mb-2">80k+</div>
              <div className="text-cyber-text-secondary">Generated Projects</div>
            </div>
            <div className="cyber-card p-6 text-center">
              <div className="stats-value mb-2">75%</div>
              <div className="text-cyber-text-secondary">Development Time Saved</div>
            </div>
            <div className="cyber-card p-6 text-center">
              <div className="stats-value mb-2">3x</div>
              <div className="text-cyber-text-secondary">Faster Deployment</div>
            </div>
          </div>

          {/* Main Form */}
          <div className="cyber-card neon-border max-w-4xl mx-auto p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="prompt"
                  className="block text-xl font-medium text-cyber-primary mb-4"
                >
                  Describe Your Backend Requirements
                </label>
                <textarea
                  id="prompt"
                  name="prompt"
                  rows={4}
                  className="cyber-input w-full text-lg"
                  placeholder="e.g., I want a SaaS for freelancers to track clients and send invoices..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="cyber-button w-full text-lg"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Your Backend...
                  </span>
                ) : (
                  'Generate Backend'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Generated Structure */}
        {structure && (
          <div className="cyber-card space-y-8 mt-16">
            <div className="flex justify-between items-center border-b border-cyber-primary/20 pb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-cyber-primary to-cyber-secondary bg-clip-text text-transparent">
                Your Generated Backend
              </h2>
              <button
                onClick={handleDownload}
                className="cyber-button"
              >
                <span className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                  </svg>
                  Download Project
                </span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Database Section */}
              <div className="space-y-6">
                <div className="cyber-card">
                  <h3 className="text-2xl font-semibold text-cyber-primary mb-6">Database Schema</h3>
                  <ul className="divide-y divide-cyber-primary/20">
                    {structure.database.tables.map((table) => (
                      <li key={table.name} className="py-4">
                        <h4 className="text-xl font-medium text-cyber-primary mb-3">{table.name}</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {table.columns.map((column) => (
                            <div key={`${table.name}-${column.name}`} className="cyber-badge">
                              <span className="font-medium">{column.name}</span>
                              <span className="text-cyber-text-secondary ml-2">({column.type})</span>
                            </div>
                          ))}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="cyber-card">
                  <h3 className="text-2xl font-semibold text-cyber-primary mb-6">Authentication</h3>
                  <div className="flex flex-wrap gap-3">
                    {structure.auth.providers.map((provider) => (
                      <div key={provider} className="cyber-badge">
                        {provider}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* API Section */}
              <div className="space-y-6">
                <div className="cyber-card">
                  <h3 className="text-2xl font-semibold text-cyber-primary mb-6">API Endpoints</h3>
                  <ul className="divide-y divide-cyber-primary/20">
                    {structure.api.endpoints.map((endpoint, index) => (
                      <li key={`${endpoint.path}-${endpoint.method}-${index}`} className="py-4">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`cyber-badge
                            ${endpoint.method === 'GET' ? 'text-green-400' :
                            endpoint.method === 'POST' ? 'text-blue-400' :
                            endpoint.method === 'PUT' ? 'text-yellow-400' :
                            'text-red-400'}`}>
                            {endpoint.method}
                          </span>
                          <code className="text-base font-mono bg-cyber-dark px-3 py-1 rounded">
                            {endpoint.path}
                          </code>
                        </div>
                        <p className="text-cyber-text-secondary">{endpoint.description}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                {structure.payments.stripeProducts.length > 0 && (
                  <div className="cyber-card">
                    <h3 className="text-2xl font-semibold text-cyber-primary mb-6">Payment Products</h3>
                    <ul className="divide-y divide-cyber-primary/20">
                      {structure.payments.stripeProducts.map((product, index) => (
                        <li key={`${product.name}-${index}`} className="py-4">
                          <div className="space-y-3">
                            <h4 className="text-xl font-medium text-cyber-primary">{product.name}</h4>
                            <p className="text-cyber-text-secondary">{product.priceDescription}</p>
                            <div className="cyber-badge">
                              {product.type}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 