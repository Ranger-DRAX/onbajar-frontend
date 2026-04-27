"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import CartCount from "./CartCount";
import CartSidebar from "./CartSidebar";
import NavBarLogo from "@/assets/OnbajarLogo.svg";
import AnimeImage from "@/assets/image/categoryImage/AnimeImage.svg";
import HarryPotterImage from "@/assets/image/categoryImage/HarryPotterImage2.svg";
import TShirtImage from "@/assets/image/categoryImage/TShirtImage.svg";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [newDropDropdownOpen, setNewDropDropdownOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* Top Bar */}
      <div className="bg-[#1a1a1a] py-2 text-gray-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-xs tracking-wide uppercase">
            branding Bangladesh
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="w-full">
          <div className="flex h-16 items-center justify-between px-8">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src={NavBarLogo}
                alt="Onbajar logo"
                width={171}
                height={38}
                priority
                className="h-auto w-42.75"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden items-center space-x-8 md:flex">
              {/* Shop with dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setShopDropdownOpen(true)}
                onMouseLeave={() => setShopDropdownOpen(false)}
              >
                <Link
                  href="/products"
                  className="flex items-center gap-1 text-sm font-normal text-gray-900 transition-colors hover:text-gray-700"
                >
                  Shop
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </Link>

                {shopDropdownOpen && (
                  <div className="absolute top-[calc(100%+10px)] left-1/2 z-50 w-[427px] -translate-x-1/2 overflow-hidden rounded-sm bg-white shadow-[0_4px_24px_rgba(0,0,0,0.12)]">
                    {[
                      {
                        href: "/products/anime",
                        label: "Anime",
                        image: AnimeImage,
                        alt: "Anime",
                      },
                      {
                        href: "/products/harry-potter",
                        label: "Harry Potter",
                        image: HarryPotterImage,
                        alt: "Harry Potter",
                      },
                      {
                        href: "/products/t-shirts",
                        label: "T-Shirts",
                        image: TShirtImage,
                        alt: "T-Shirts",
                      },
                    ].map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="group flex h-[70px] w-full items-center justify-between border-b border-[#D9D9D9] bg-white px-4 transition-colors duration-200 last:border-b-0 hover:bg-[#0A0A0A]"
                      >
                        <div className="flex items-center gap-3">
                          <Image
                            src={item.image}
                            alt={item.alt}
                            width={30}
                            height={30}
                            className="h-[30px] w-[30px] object-contain"
                          />
                          <span className="text-[20px] font-normal text-black transition-colors duration-200 group-hover:text-white">
                            {item.label}
                          </span>
                        </div>

                        <svg
                          className="h-6 w-6 text-white opacity-0 transition-all duration-200 group-hover:opacity-100"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 12h14M13 4l8 8-8 8"
                          />
                        </svg>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* New Drop with dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setNewDropDropdownOpen(true)}
                onMouseLeave={() => setNewDropDropdownOpen(false)}
              >
                <Link
                  href="/new-drop"
                  className="flex items-center gap-1 text-sm font-normal text-gray-900 transition-colors hover:text-gray-700"
                >
                  New Drop
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </Link>
                {newDropDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 rounded-md border border-gray-200 bg-white py-2 shadow-lg">
                    <Link
                      href="/new-drop/latest"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Latest Arrivals
                    </Link>
                    <Link
                      href="/new-drop/trending"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Trending Now
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/#about"
                className="text-sm font-normal text-gray-900 transition-colors hover:text-gray-700"
              >
                About Us
              </Link>
              <Link
                href="/#bulk-order"
                className="text-sm font-normal text-gray-900 transition-colors hover:text-gray-700"
              >
                Bulk Order
              </Link>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Search Icon */}
              <button
                aria-label="Search"
                className="text-gray-900 transition-colors hover:text-gray-700"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>

              {/* Separator */}
              <div className="h-5 w-px bg-gray-300"></div>

              {/* Cart Icon */}
              <button
                type="button"
                aria-label="Open shopping cart"
                className="relative text-gray-900 transition-colors hover:text-gray-700"
                onClick={() => setIsCartOpen(true)}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <CartCount />
              </button>

              {/* Mobile menu button */}
              <button
                aria-label="Toggle menu"
                className="text-gray-900 hover:text-gray-700 md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="border-t py-4 md:hidden">
              <div className="flex flex-col space-y-4">
                <Link
                  href="/products"
                  className="font-normal text-gray-900 transition-colors hover:text-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Shop
                </Link>
                <Link
                  href="/new-drop"
                  className="font-normal text-gray-900 transition-colors hover:text-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  New Drop
                </Link>
                <Link
                  href="/#about"
                  className="font-normal text-gray-900 transition-colors hover:text-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About Us
                </Link>
                <Link
                  href="/#bulk-order"
                  className="font-normal text-gray-900 transition-colors hover:text-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Bulk Order
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      <CartSidebar open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
}
