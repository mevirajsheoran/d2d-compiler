// src/app/(protected)/dashboard/[session]/layout.tsx
import { Navbar } from "@/components/navbar";
import { ProfileSync } from "@/components/auth/profile-sync";

interface SessionLayoutProps {
  children: React.ReactNode;
}

export default function SessionLayout({ children }: SessionLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <ProfileSync />
      <Navbar />
      <main>{children}</main>
    </div>
  );
}