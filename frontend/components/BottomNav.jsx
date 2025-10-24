"use client";
import { Home, Folder, Heart, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Beranda", icon: Home, href: "/beranda" },
    { name: "Kategori", icon: Folder, href: "/kategori" },
    { name: "Wishlist", icon: Heart, href: "/wishlist" },
    { name: "Profil", icon: User, href: "/profil" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#fefaf6] border-t border-[#d6c2aa] shadow-sm flex justify-around py-2 z-50">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            href={item.href}
            className="flex flex-col items-center text-center text-xs font-medium"
          >
            <Icon
              size={24}
              className={`${
                isActive ? "text-[#704d31]" : "text-[#b08968]"
              } transition-colors duration-200`}
            />
            <span
              className={`mt-1 ${
                isActive ? "text-[#704d31]" : "text-[#b08968]"
              }`}
            >
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
