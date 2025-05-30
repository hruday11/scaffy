"use client";
import { usePathname } from "next/navigation";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark, neobrutalism } from "@clerk/themes";

const authRoutes = ["/sign-in", "/sign-up"];

export default function AuthButtons() {
  const { user } = useUser();
  const pathname = usePathname();
  const { theme } = useTheme();

  if (authRoutes.includes(pathname)) return null;

  return (
    <>
      {user ? (
        <UserButton
          appearance={{
            baseTheme: theme === "dark" ? neobrutalism : dark,
            elements: {
              userButtonAvatarBox: "w-11 h-11 ring-2 ring-cyber-primary/80 dark:ring-cyber-secondary/80 shadow-neon backdrop-blur-md",
              userButtonPopoverCard: "bg-cyber-dark/90 dark:bg-cyber-lightCard/90 border border-cyber-primary/30 dark:border-cyber-secondary/30 shadow-neon-strong backdrop-blur-xl rounded-xl text-cyber-lightText dark:text-cyber-black",
              userButtonPopoverActionButton: "text-cyber-lightText dark:text-cyber-black hover:text-cyber-primary dark:hover:text-cyber-secondary",
              userButtonPopoverFooter: "bg-transparent border-none shadow-none",
            },
          }}
        />
      ) : (
        <>
          <SignInButton mode="modal">
            <button className="cyber-button px-5 py-2 text-base font-semibold shadow-neon backdrop-blur-md bg-cyber-dark/80 dark:bg-cyber-lightCard/80 border-cyber-primary/40 hover:bg-cyber-primary/20 dark:hover:bg-cyber-secondary/20 transition">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="cyber-button px-5 py-2 text-base font-semibold shadow-neon backdrop-blur-md bg-cyber-dark/80 dark:bg-cyber-lightCard/80 border-cyber-primary/40 hover:bg-cyber-primary/20 dark:hover:bg-cyber-secondary/20 transition">
              Sign Up
            </button>
          </SignUpButton>
        </>
      )}
    </>
  );
} 