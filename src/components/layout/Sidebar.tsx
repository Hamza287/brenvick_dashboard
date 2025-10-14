"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className = "" }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: "Dashboard", path: "/" },
    { name: "Add Products", path: "/products/add" },
    { name: "Products", path: "/products" },
    { name: "Orders", path: "/orders" },
    { name: "Payment", path: "/payments" },
    { name: "Messages", path: "/messages" },
    { name: "Settings", path: "/settings" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <div
      className={`flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      } ${className}`}
    >
      {/* Header with Logo and Toggle */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center">
            <img 
              src="/logo.svg" 
              alt="Brenvick Logo" 
              className="h-8 mr-2"
            />
            <span className="text-xl font-semibold text-gray-900">Brenvick</span>
          </div>
        )}
        {isCollapsed && (
          <div className="flex justify-center w-full">
            <img 
              src="/logo.svg" 
              alt="Brenvick Logo" 
              className="h-8"
            />
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isCollapsed ? "➡️" : "⬅️"}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <button
                onClick={() => router.push(item.path)}
                className={`w-full flex items-center rounded-lg px-3 py-3 text-left transition-colors ${
                  isActive(item.path)
                    ? "bg-[var(--brand-red)] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {!isCollapsed && (
                  <span className="font-medium">{item.name}</span>
                )}
                {isCollapsed && (
                  <span className="text-xs font-medium truncate w-full text-center">
                    {item.name.split(' ').map(word => word[0]).join('')}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile Section */}
      <div className="border-t border-gray-200 p-4">
        <div className={`flex items-center ${isCollapsed ? "justify-center" : "space-x-3"}`}>
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-gray-600">SA</span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                Syed Adeel Abbas
              </p>
              <p className="text-xs text-gray-500 truncate">
                Content Lead
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}