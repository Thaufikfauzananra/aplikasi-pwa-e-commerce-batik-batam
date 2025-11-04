"use client";
import { Home, Folder, ShoppingCart, Heart, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function BottomNav() {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cartData") || "[]");
      setCartCount(cart.length);
    };
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    return () => window.removeEventListener('storage', updateCartCount);
  }, []);

  // Don't show on auth pages or payment pages
  const hideOnPages = ["/login", "/register", "/pembayaran", "/pembayaran-berhasil"];
  if (hideOnPages.some(page => pathname.startsWith(page))) {
    return null;
  }

  const navItems = [
    { name: "Beranda", icon: Home, href: "/Beranda" },
    { name: "Kategori", icon: Folder, href: "/kategori" },
    { name: "Keranjang", icon: ShoppingCart, href: "/keranjang", count: cartCount },
    { name: "Wishlist", icon: Heart, href: "/wishlist" },
    { name: "Profil", icon: User, href: "/profil" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#704d31] border-t border-[#5a3921] shadow-lg flex justify-around py-2 z-50 safe-area-inset-bottom">
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            href={item.href}
            className="flex flex-col items-center text-center text-xs font-medium relative py-2 px-3"
          >
            <div className="relative">
              <Icon
                size={22}
                className={`${
                  isActive ? "text-white" : "text-[#d6c2aa]"
                } transition-colors duration-200`}
              />
              {item.count > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {item.count > 9 ? '9+' : item.count}
                </span>
              )}
            </div>
            <span
              className={`mt-1 ${
                isActive ? "text-white font-semibold" : "text-[#d6c2aa]"
              } transition-colors duration-200`}
            >
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
