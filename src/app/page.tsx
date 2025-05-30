import PromptForm from '@/components/PromptForm';
import { UserButton } from '@clerk/nextjs';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <PromptForm />
        <UserButton
          appearance={{
            elements: {
              userButtonPopoverCard: "bg-cyber-dark/90 border border-cyber-primary/30 shadow-neon-strong backdrop-blur-xl rounded-xl",
              userButtonPopoverActionButton: "text-cyber-lightText hover:text-cyber-primary",
              userButtonPopoverFooter: "bg-transparent border-none shadow-none",
            }
          }}
        />
      </div>
    </div>
  );
}
