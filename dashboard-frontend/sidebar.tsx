'use client';

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, BookOpen, PenTool, MessageCircle } from "lucide-react";


// Utility function for merging class names
function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const mainNavItems = [
  {
    icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dashboard-Rllxc6NyHq2F1bce1LRF7k97yl6REH.png",
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/progress-7X8whx15v0mjTj9P8XcN3Rbvrdg5Z4.png",
    label: "Progress",
    href: "/progress",
  },
  {
    icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/journal-pL2uawq5l2Jrw4yXWguWnoWNqWrJfc.png",
    label: "Journal",
    href: "/journal",
  },
  {
    icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/quizz-7LaTZmLJ9m8WEhTK6E43irFnSrahWD.png",
    label: "Quiz",
    href: "/quiz",
  },
  {
    icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/chat-weyApYaF1xf0TwluX21oSaba8iMGzf.png",
    label: "Chat",
    href: "/chat",
  },
  {
    icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/confession-Bp95oWHo2nxKAsUG2vZfhkCJXZE3xa.png",
    label: "Confessions",
    href: "/confessions",
  },
];

const bottomNavItems = [
  {
    icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/profile-x2qaRDZN12LeGf5uPJQ3C7NIiURyMy.png",
    label: "Profile",
    href: "/profile",
  },
  {
    icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/settings-Lpklw4uVHy8CpLskQeikjd1NNZRAHz.png",
    label: "Settings",
    href: "/settings",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [imageError, setImageError] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  React.useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const renderNavItems = (items: typeof mainNavItems) =>
    items.map((item) => (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-300 ease-in-out",
          pathname === item.href 
            ? "bg-blue-700 text-white font-medium shadow-md" 
            : "text-blue-300 hover:bg-blue-700 hover:text-white",
          isCollapsed ? "justify-center w-14 mx-auto" : "w-full"
        )}
        title={isCollapsed ? item.label : undefined}
      >
        <div className="relative flex-shrink-0 w-6 h-6">
          <Image
            src={item.icon || "/placeholder.svg"}
            alt={`${item.label} icon`}
            width={24}
            height={24}
            className="object-contain"
          />
        </div>
        {!isCollapsed && <span>{item.label}</span>}
      </Link>
    ));

  return (
    <aside
      className={cn(
        "border-r border-blue-700 bg-blue-800 font-mono relative overflow-hidden transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-soft {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-pulse-soft {
          animation: pulse-soft 2s ease-in-out infinite;
        }
      `}</style>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-blue-700">
          <Link className={cn("flex items-center", isCollapsed ? "justify-center" : "")} href="#">
            <div className="relative w-10 h-10 mr-2">
              {!imageError ? (
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/book-Y8AjG7ZMNLHlyI10HWSQ3VLGJLJskX.png"
                  alt="StudyZen Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-10 h-10 bg-blue-600 flex items-center justify-center rounded-full">
                  <span className="text-white font-bold text-xl">S</span>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <span
                className="text-2xl font-bold text-white"
                style={{
                  fontFamily: "'Fredoka One', cursive",
                  letterSpacing: "-0.02em",
                  transform: "rotate(-2deg)",
                }}
              >
                StudyZen
              </span>
            )}
          </Link>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
          </button>
        </div>
        <nav className="flex flex-col justify-between flex-grow py-4 overflow-y-auto">
          <div className="space-y-1">{renderNavItems(mainNavItems)}</div>
          <div className="mt-auto pt-4 border-t border-blue-700">{renderNavItems(bottomNavItems)}</div>
        </nav>
      </div>

      {/* Animated background elements */}
      <div className="absolute top-20 left-4 text-blue-200 opacity-20 animate-float">
        <BookOpen size={48} />
      </div>
      <div
        className="absolute bottom-20 right-4 text-blue-200 opacity-20 animate-float"
        style={{ animationDelay: "1s" }}
      >
        <PenTool size={40} />
      </div>
      <div
        className="absolute top-1/2 left-1/4 text-blue-200 opacity-20 animate-float"
        style={{ animationDelay: "1.5s" }}
      >
        <MessageCircle size={36} />
      </div>
    </aside>
  );
}