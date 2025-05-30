import PromptForm from '@/components/PromptForm';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-lg text-gray-600">
            Generate production-ready backend code from natural language prompts
          </p>
        </div>
        
        <PromptForm />
      </div>
    </div>
  );
}
