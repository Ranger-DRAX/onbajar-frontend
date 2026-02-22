"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [newDropDropdownOpen, setNewDropDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* Top Bar */}
      <div className="bg-[#1a1a1a] text-gray-300 py-2">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-xs uppercase tracking-wide">
            BRANDING BANGLADESH
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              {/* Circular Icon (Q/Target style) */}
              <div className="relative w-8 h-8">
                <svg
                  className="w-8 h-8"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="16"
                    cy="16"
                    r="14"
                    stroke="black"
                    strokeWidth="2"
                    fill="none"
                  />
                  <circle cx="16" cy="16" r="4" fill="black" />
                </svg>
              </div>
              <span className="text-xl font-bold text-black uppercase tracking-tight">
                ONBAJAR
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {/* Shop with dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setShopDropdownOpen(true)}
                onMouseLeave={() => setShopDropdownOpen(false)}
              >
                <Link
                  href="/shop"
                  className="text-gray-900 hover:text-gray-700 font-normal text-sm flex items-center gap-1 transition-colors"
                >
                  Shop
                  <svg
                    className="w-4 h-4"
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
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg border border-gray-200 rounded-md py-2">
                    <Link
                      href="/shop/all"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      All Products
                    </Link>
                    <Link
                      href="/shop/categories"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Categories
                    </Link>
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
                  className="text-gray-900 hover:text-gray-700 font-normal text-sm flex items-center gap-1 transition-colors"
                >
                  New Drop
                  <svg
                    className="w-4 h-4"
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
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg border border-gray-200 rounded-md py-2">
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
                href="/about-us"
                className="text-gray-900 hover:text-gray-700 font-normal text-sm transition-colors"
              >
                About Us
              </Link>
              <Link
                href="/bulk-order"
                className="text-gray-900 hover:text-gray-700 font-normal text-sm transition-colors"
              >
                Bulk Order
              </Link>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Search Icon */}
              <button
                aria-label="Search"
                className="text-gray-900 hover:text-gray-700 transition-colors"
              >
                <svg
                  className="w-5 h-5"
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
                aria-label="Shopping cart"
                className="text-gray-900 hover:text-gray-700 transition-colors relative"
              >
                <svg
                  className="w-5 h-5"
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
                {/* Notification dot */}
                <span className="absolute -top-1 -right-1 bg-black w-2 h-2 rounded-full"></span>
              </button>

              {/* Mobile menu button */}
              <button
                aria-label="Toggle menu"
                className="md:hidden text-gray-900 hover:text-gray-700"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <svg
                  className="w-6 h-6"
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
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col space-y-4">
                <Link
                  href="/shop"
                  className="text-gray-900 hover:text-gray-700 font-normal transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Shop
                </Link>
                <Link
                  href="/new-drop"
                  className="text-gray-900 hover:text-gray-700 font-normal transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  New Drop
                </Link>
                <Link
                  href="/about-us"
                  className="text-gray-900 hover:text-gray-700 font-normal transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About Us
                </Link>
                <Link
                  href="/bulk-order"
                  className="text-gray-900 hover:text-gray-700 font-normal transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Bulk Order
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
