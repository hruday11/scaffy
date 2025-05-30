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
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-cyber-primary via-cyber-secondary to-cyber-primary bg-clip-text text-transparent drop-shadow-[0_0_30px_#00b3ff] dark:drop-shadow-[0_0_30px_#00b3ff] animate-pulse">
            Scaffy
          </h1>
          <p className="text-2xl text-cyber-text-secondary mb-12 max-w-3xl mx-auto dark:text-cyber-lightText/80 font-light tracking-wide">
            Generate production-ready backend code in seconds, not days. Transform your ideas into scalable infrastructure.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
            <div className="cyber-card bg-cyber-dark/40 dark:bg-cyber-lightCard/40 p-8 text-center border-cyber-primary/20 shadow-neon backdrop-blur-xl hover:border-cyber-primary/40 transition-all duration-300">
              <div className="stats-value mb-3 text-4xl font-bold bg-gradient-to-r from-cyber-primary to-cyber-secondary bg-clip-text text-transparent">80k+</div>
              <div className="text-cyber-text-secondary dark:text-cyber-lightText/80 text-lg">Generated Projects</div>
            </div>
            <div className="cyber-card bg-cyber-dark/40 dark:bg-cyber-lightCard/40 p-8 text-center border-cyber-primary/20 shadow-neon backdrop-blur-xl hover:border-cyber-primary/40 transition-all duration-300">
              <div className="stats-value mb-3 text-4xl font-bold bg-gradient-to-r from-cyber-primary to-cyber-secondary bg-clip-text text-transparent">75%</div>
              <div className="text-cyber-text-secondary dark:text-cyber-lightText/80 text-lg">Development Time Saved</div>
            </div>
            <div className="cyber-card bg-cyber-dark/40 dark:bg-cyber-lightCard/40 p-8 text-center border-cyber-primary/20 shadow-neon backdrop-blur-xl hover:border-cyber-primary/40 transition-all duration-300">
              <div className="stats-value mb-3 text-4xl font-bold bg-gradient-to-r from-cyber-primary to-cyber-secondary bg-clip-text text-transparent">3x</div>
              <div className="text-cyber-text-secondary dark:text-cyber-lightText/80 text-lg">Faster Deployment</div>
            </div>
          </div>

          {/* Main Form */}
          <div className="cyber-card neon-border max-w-4xl mx-auto p-10 bg-cyber-dark/30 dark:bg-cyber-lightCard/30 border-cyber-primary/20 shadow-neon-strong backdrop-blur-xl hover:border-cyber-primary/40 transition-all duration-300">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label
                  htmlFor="prompt"
                  className="block text-2xl font-bold mb-6 bg-gradient-to-r from-cyber-primary via-cyber-secondary to-cyber-primary bg-clip-text text-transparent drop-shadow-[0_0_30px_#00b3ff] dark:drop-shadow-[0_0_30px_#00b3ff] animate-pulse tracking-wide"
                >
                  Describe Your Backend Requirements
                </label>
                <textarea
                  id="prompt"
                  name="prompt"
                  rows={4}
                  className="cyber-input w-full text-lg bg-cyber-black/40 dark:bg-cyber-light/40 border-cyber-primary/20 focus:border-cyber-primary/60 dark:text-cyber-lightText rounded-lg p-4 transition-all duration-300"
                  placeholder="e.g., I want a SaaS for freelancers to track clients and send invoices..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="cyber-button w-full text-xl py-4 font-medium tracking-wide hover:scale-[1.02] transition-all duration-300"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
          <div className="cyber-card space-y-8 mt-16 bg-cyber-dark/30 dark:bg-cyber-lightCard/30 border-cyber-primary/20 shadow-neon-strong backdrop-blur-xl hover:border-cyber-primary/40 transition-all duration-300 p-10">
            <div className="flex justify-between items-center border-b border-cyber-primary/20 pb-8">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-cyber-primary to-cyber-secondary bg-clip-text text-transparent tracking-wide">
                Your Generated Backend
              </h2>
              <button
                onClick={handleDownload}
                className="cyber-button px-6 py-3 text-lg font-medium tracking-wide hover:scale-[1.02] transition-all duration-300"
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
              <div className="space-y-8">
                <div className="cyber-card bg-cyber-dark/40 dark:bg-cyber-lightCard/40 p-8 border-cyber-primary/20 shadow-neon backdrop-blur-xl hover:border-cyber-primary/40 transition-all duration-300">
                  <h3 className="text-2xl font-semibold text-cyber-primary mb-8 tracking-wide">Database Schema</h3>
                  <ul className="divide-y divide-cyber-primary/20">
                    {structure.database.tables.map((table) => (
                      <li key={table.name} className="py-6">
                        <h4 className="text-xl font-medium text-cyber-primary mb-4 tracking-wide">{table.name}</h4>
                        <div className="grid grid-cols-2 gap-4">
                          {table.fields.map((field) => (
                            <div key={`${table.name}-${field.name}`} className="cyber-badge bg-cyber-dark/60 dark:bg-cyber-light/60 border-cyber-primary/20 hover:border-cyber-primary/40 transition-all duration-300">
                              <span className="font-medium">{field.name}</span>
                              <span className="text-cyber-text-secondary ml-2">({field.type})</span>
                            </div>
                          ))}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="cyber-card bg-cyber-dark/40 dark:bg-cyber-lightCard/40 p-8 border-cyber-primary/20 shadow-neon backdrop-blur-xl hover:border-cyber-primary/40 transition-all duration-300">
                  <h3 className="text-2xl font-semibold text-cyber-primary mb-8 tracking-wide">Authentication</h3>
                  <div className="flex flex-wrap gap-4">
                    {structure.auth.providers.map((provider, idx) => (
                      <div key={provider.name || idx} className="cyber-badge bg-cyber-dark/60 dark:bg-cyber-light/60 border-cyber-primary/20 hover:border-cyber-primary/40 transition-all duration-300">
                        {provider.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* API Section */}
              <div className="space-y-8">
                <div className="cyber-card bg-cyber-dark/40 dark:bg-cyber-lightCard/40 p-8 border-cyber-primary/20 shadow-neon backdrop-blur-xl hover:border-cyber-primary/40 transition-all duration-300">
                  <h3 className="text-2xl font-semibold text-cyber-primary mb-8 tracking-wide">API Endpoints</h3>
                  <ul className="divide-y divide-cyber-primary/20">
                    {structure.api.endpoints.map((endpoint, index) => (
                      <li key={`${endpoint.path}-${endpoint.method}-${index}`} className="py-6">
                        <div className="flex items-center gap-4 mb-3">
                          <span className={`cyber-badge bg-cyber-dark/60 dark:bg-cyber-light/60 border-cyber-primary/20 hover:border-cyber-primary/40 transition-all duration-300
                            ${endpoint.method === 'GET' ? 'text-green-400' :
                            endpoint.method === 'POST' ? 'text-blue-400' :
                            endpoint.method === 'PUT' ? 'text-yellow-400' :
                            'text-red-400'}`}>
                            {endpoint.method}
                          </span>
                          <code className="text-base font-mono bg-cyber-dark/60 dark:bg-cyber-light/60 px-4 py-2 rounded border border-cyber-primary/20">
                            {endpoint.path}
                          </code>
                        </div>
                        <p className="text-cyber-text-secondary dark:text-cyber-lightText/80">{endpoint.description}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                {structure.payments.products.length > 0 && (
                  <div className="cyber-card bg-cyber-dark/40 dark:bg-cyber-lightCard/40 p-8 border-cyber-primary/20 shadow-neon backdrop-blur-xl hover:border-cyber-primary/40 transition-all duration-300">
                    <h3 className="text-2xl font-semibold text-cyber-primary mb-8 tracking-wide">Payment Products</h3>
                    <ul className="divide-y divide-cyber-primary/20">
                      {structure.payments.products.map((product, index) => (
                        <li key={`${product.name}-${index}`} className="py-6">
                          <div className="space-y-4">
                            <h4 className="text-xl font-medium text-cyber-primary tracking-wide">{product.name}</h4>
                            <p className="text-cyber-text-secondary dark:text-cyber-lightText/80">{product.priceDescription}</p>
                            <div className="cyber-badge bg-cyber-dark/60 dark:bg-cyber-light/60 border-cyber-primary/20 hover:border-cyber-primary/40 transition-all duration-300">
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