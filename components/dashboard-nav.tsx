"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();

  // Determine if we are deep into a subpage and should show a Back button
  const isDeepPage = pathname.split("/").length > 3 || pathname.includes("/courses/") || pathname.includes("/edit/");

  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/courses", label: "Courses" },
    { href: "/dashboard/enrolled", label: "My Courses" },
    { href: "/dashboard/profile", label: "Profile" },
  ];

  return (
    <nav className="w-full bg-white dark:bg-gray-900 shadow p-4 flex gap-6 items-center flex-wrap">
      
      {isDeepPage && (
        <button
          onClick={() => router.back()}
          className="mr-auto flex items-center gap-1 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 font-medium"
        >
          <span className="text-xl leading-none">&lsaquo;</span> Back
        </button>
      )}

      <div className={`flex gap-6 justify-center ${isDeepPage ? "" : "w-full"}`}>
        {links.map((link) => {
          // Exact match or active sub-route logic
          const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href + "/"));
          
          return (
            <Link 
              key={link.href}
              href={link.href} 
              className={`font-medium transition-colors ${
                isActive 
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 pb-1" 
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 pb-1"
              }`}
            >
              {link.label}
            </Link>
          );
        })}

        <Link href="/logout" className="text-red-500 font-medium pb-1 ml-auto md:ml-0">
          Logout
        </Link>
      </div>

    </nav>
  );
}