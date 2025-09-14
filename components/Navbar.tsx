'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Bookmark,
  BarChart3,
  CreditCard,
  HelpCircle
} from 'lucide-react';

interface NavbarProps {
  user?: {
    name: string;
    email: string;
    subscription: string;
  };
}

export default function Navbar({ user }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white border-b border-secondary-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-gradient">Client Finder</h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/search"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/search')
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-secondary-600 hover:text-secondary-900'
              }`}
            >
              <Search className="w-4 h-4" />
              Search
            </Link>

            {user && (
              <>
                <Link
                  href="/dashboard"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/dashboard')
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-secondary-600 hover:text-secondary-900'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  Dashboard
                </Link>

                <Link
                  href="/saved"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/saved')
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-secondary-600 hover:text-secondary-900'
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                  Saved
                </Link>
              </>
            )}

            <Link
              href="/pricing"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/pricing')
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-secondary-600 hover:text-secondary-900'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              Pricing
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-secondary-900">{user.name}</p>
                    <p className="text-xs text-secondary-500 capitalize">{user.subscription} Plan</p>
                  </div>
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-secondary-200 py-1 z-50">
                    <div className="px-4 py-2 border-b border-secondary-100">
                      <p className="text-sm font-medium text-secondary-900">{user.name}</p>
                      <p className="text-xs text-secondary-500">{user.email}</p>
                    </div>

                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                    >
                      <BarChart3 className="w-4 h-4" />
                      Dashboard
                    </Link>

                    <Link
                      href="/settings"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>

                    <Link
                      href="/help"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                    >
                      <HelpCircle className="w-4 h-4" />
                      Help & Support
                    </Link>

                    <div className="border-t border-secondary-100 mt-1">
                      <button className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="text-secondary-600 hover:text-secondary-900 px-3 py-2 text-sm font-medium"
                >
                  Sign in
                </Link>
                <Link href="/auth/register" className="btn-primary text-sm">
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-secondary-600 hover:text-secondary-900"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-secondary-200 py-4">
            <div className="space-y-2">
              <Link
                href="/search"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-secondary-700 hover:bg-secondary-50"
                onClick={() => setIsMenuOpen(false)}
              >
                <Search className="w-5 h-5" />
                Search
              </Link>

              {user && (
                <>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-secondary-700 hover:bg-secondary-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <BarChart3 className="w-5 h-5" />
                    Dashboard
                  </Link>

                  <Link
                    href="/saved"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-secondary-700 hover:bg-secondary-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Bookmark className="w-5 h-5" />
                    Saved
                  </Link>
                </>
              )}

              <Link
                href="/pricing"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-secondary-700 hover:bg-secondary-50"
                onClick={() => setIsMenuOpen(false)}
              >
                <CreditCard className="w-5 h-5" />
                Pricing
              </Link>

              {!user && (
                <div className="pt-4 border-t border-secondary-200 space-y-2">
                  <Link
                    href="/auth/login"
                    className="block px-3 py-2 text-secondary-700 hover:bg-secondary-50 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}