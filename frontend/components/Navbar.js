"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Search, ShoppingCart, Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar({ title, showBack = false }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if cart has items
  const [cartCount, setCartCount] = useState(0);
  
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cartData") || "[]");
      setCartCount(cart.length);
    };
    
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    // Listen for custom cart update events
    window.addEventListener('cartUpdated', updateCartCount);
    
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  const isAuthPage = pathname === "/login" || pathname === "/register";

  // Mobile Navbar
  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    return (
      <header className="w-full bg-white border-b border-[#d6c2aa] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-center">
            <h1 className="text-lg md:text-xl font-bold text-[#704d31]">
              BATIK CINDUR BATAM
            </h1>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      {/* Mobile Navbar */}
      <header className="md:hidden w-full bg-white border-b border-[#d6c2aa] sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            {showBack && (
              <button onClick={() => router.back()} className="text-[#704d31]">
                <ArrowLeft size={20} />
              </button>
            )}
            {title ? (
              <h1 className="text-base font-semibold text-[#5a3921]">{title}</h1>
            ) : (
              <h1 className="text-base font-bold text-[#704d31]">BATIK</h1>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Link href="/cari" className="text-[#704d31]">
              <Search size={20} />
            </Link>
            <Link href="/keranjang" className="text-[#704d31] relative">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Web Navbar */}
      <header className="hidden md:block w-full bg-white border-b border-[#d6c2aa] sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {showBack && (
                <button onClick={() => router.back()} className="text-[#704d31] hover:text-[#5a3921] transition">
                  <ArrowLeft size={24} />
                </button>
              )}
              <Link href="/Beranda" className="flex items-center gap-2">
                <Image
                  src="/logo_batik.jpg"
                  alt="Batik Cindur Batam"
                  width={40}
                  height={40}
                  className="rounded"
                />
                <h1 className="text-xl font-bold text-[#704d31]">BATIK CINDUR BATAM</h1>
              </Link>
            </div>
            <nav className="hidden lg:flex items-center gap-6">
              <Link href="/Beranda" className="text-[#5a3921] hover:text-[#704d31] font-medium transition">
                Beranda
              </Link>
              <Link href="/kategori" className="text-[#5a3921] hover:text-[#704d31] font-medium transition">
                Kategori
              </Link>
              <Link href="/wishlist" className="text-[#5a3921] hover:text-[#704d31] font-medium transition">
                Wishlist
              </Link>
              <Link href="/profil" className="text-[#5a3921] hover:text-[#704d31] font-medium transition">
                Profil
              </Link>
            </nav>
            <div className="flex items-center gap-4">
              <Link href="/cari" className="text-[#704d31] hover:text-[#5a3921] transition">
                <Search size={22} />
              </Link>
              <Link href="/keranjang" className="text-[#704d31] hover:text-[#5a3921] relative transition">
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-[#704d31]"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Dropdown (Web) */}
      {mobileMenuOpen && (
        <div className="hidden md:block lg:hidden fixed top-[73px] left-0 right-0 bg-white border-b border-[#d6c2aa] shadow-lg z-40">
          <nav className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-3">
            <Link href="/Beranda" className="text-[#5a3921] hover:text-[#704d31] font-medium transition">
              Beranda
            </Link>
            <Link href="/kategori" className="text-[#5a3921] hover:text-[#704d31] font-medium transition">
              Kategori
            </Link>
            <Link href="/wishlist" className="text-[#5a3921] hover:text-[#704d31] font-medium transition">
              Wishlist
            </Link>
            <Link href="/profil" className="text-[#5a3921] hover:text-[#704d31] font-medium transition">
              Profil
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}

