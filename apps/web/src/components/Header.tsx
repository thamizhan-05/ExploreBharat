'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Compass, 
  MapPin, 
  Search, 
  Calendar, 
  Sparkles, 
  User, 
  LogOut, 
  ShieldCheck, 
  Menu, 
  X,
  Hotel as HotelIcon,
  PlusCircle,
  Route,
  Train,
  Wallet,
  Award
} from 'lucide-react';
import { getCurrentUser, clearAuthToken } from '../lib/api';
import Logo from './Logo';
import { SuggestPlaceModal } from './SuggestPlaceModal';

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [suggestModalOpen, setSuggestModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const handleLogout = () => {
    clearAuthToken();
    setUser(null);
    router.push('/login');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Identity */}
          <Logo variant="primary" size="md" href="/" />

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative w-64 lg:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search forts, Jaipur, train, Taj..."
              className="w-full pl-10 pr-4 py-2 bg-stone-100/80 focus:bg-white text-xs lg:text-sm rounded-full border border-stone-200 focus:outline-none focus:ring-2 focus:ring-bharat-saffron focus:border-transparent transition-all"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5" />
          </form>

          {/* Desktop Navigation Links - Refocused Core Traveler Journey */}
          <nav className="hidden lg:flex items-center space-x-6 text-sm font-semibold text-stone-700">
            <Link href="/destinations" className="hover:text-bharat-saffron transition-colors flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-stone-400" />
              Destinations
            </Link>
            <Link href="/attractions" className="hover:text-bharat-saffron transition-colors flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-stone-400" />
              Attractions
            </Link>
            <Link 
              href="/smart-journey" 
              className="text-stone-700 hover:text-bharat-saffron transition-colors flex items-center gap-1.5 group"
            >
              <Route className="w-4 h-4 text-bharat-saffron group-hover:scale-110 transition-transform" />
              <span>Plan Trip</span>
            </Link>
            <Link href="/hotels" className="hover:text-bharat-saffron transition-colors flex items-center gap-1.5">
              <HotelIcon className="w-4 h-4 text-stone-400" />
              Hotels
            </Link>
            <Link href="/transport" className="hover:text-bharat-saffron transition-colors flex items-center gap-1.5">
              <Train className="w-4 h-4 text-stone-400" />
              Transport
            </Link>
            <Link href="/trips" className="hover:text-bharat-saffron transition-colors flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-stone-400" />
              My Trips
            </Link>
          </nav>

          {/* User Profile / Auth Actions */}
          <div className="hidden lg:flex items-center space-x-3 relative">
            <Link 
              href="/ai-planner" 
              className="text-bharat-saffron font-bold flex items-center gap-1 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-200/60 hover:bg-orange-100 transition-all text-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-bharat-saffron" />
              AI Synthesizer
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-full hover:bg-stone-100 border border-stone-200 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-bharat-indigo to-blue-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-stone-800 leading-tight">{user.name.split(' ')[0]}</p>
                    <span className="text-[9px] text-stone-500 font-medium capitalize">{user.role.toLowerCase()}</span>
                  </div>
                </button>

                {/* Profile & Secondary Features Dropdown */}
                {userMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-200/90 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setUserMenuOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-stone-100">
                      <p className="text-xs font-bold text-stone-900">{user.name}</p>
                      <p className="text-[11px] text-stone-500 truncate">{user.email}</p>
                    </div>

                    <div className="py-1 text-xs text-stone-700 font-medium">
                      <Link 
                        href="/trips" 
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-stone-50 transition-colors"
                      >
                        <Calendar className="w-4 h-4 text-stone-400" />
                        <span>My Trips & Itineraries</span>
                      </Link>
                      <Link 
                        href="/bookings" 
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-stone-50 transition-colors"
                      >
                        <Route className="w-4 h-4 text-stone-400" />
                        <span>Bookings & Passes</span>
                      </Link>
                      <Link 
                        href="/wallet" 
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-stone-50 transition-colors"
                      >
                        <Wallet className="w-4 h-4 text-stone-400" />
                        <span>Travel Wallet</span>
                      </Link>
                      <Link 
                        href="/passport" 
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-stone-50 transition-colors"
                      >
                        <Award className="w-4 h-4 text-stone-400" />
                        <span>Travel Passport</span>
                      </Link>
                      <button 
                        onClick={() => {
                          setUserMenuOpen(false);
                          setSuggestModalOpen(true);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-stone-50 transition-colors text-left"
                      >
                        <PlusCircle className="w-4 h-4 text-stone-400" />
                        <span>Suggest a Place</span>
                      </button>
                      <Link 
                        href="/vendor" 
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-stone-50 transition-colors"
                      >
                        <HotelIcon className="w-4 h-4 text-stone-400" />
                        <span>Partner / Vendor Portal</span>
                      </Link>

                      {user?.role === 'ADMIN' && (
                        <Link 
                          href="/admin" 
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 bg-indigo-50/60 text-bharat-indigo font-bold hover:bg-indigo-100/60 transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4 text-bharat-indigo" />
                          <span>Admin Data Center</span>
                        </Link>
                      )}
                    </div>

                    <div className="pt-1 border-t border-stone-100">
                      <button 
                        onClick={() => {
                          setUserMenuOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="text-xs font-semibold text-stone-700 hover:text-bharat-saffron px-3 py-2 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/login?mode=signup"
                  className="text-xs font-bold text-white bg-bharat-saffron hover:bg-bharat-terracotta px-4 py-2 rounded-full shadow-md shadow-orange-500/20 transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search attractions, cities..."
              className="w-full pl-10 pr-4 py-2.5 bg-stone-100 text-sm rounded-full border border-stone-200"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          </form>

          <div className="space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 px-1">
              Core Journey
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm font-medium">
              <Link 
                href="/destinations" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 bg-stone-50 hover:bg-stone-100 rounded-xl text-stone-800 flex items-center gap-2"
              >
                <MapPin className="w-4 h-4 text-bharat-saffron" /> Destinations
              </Link>
              <Link 
                href="/attractions" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 bg-stone-50 hover:bg-stone-100 rounded-xl text-stone-800 flex items-center gap-2"
              >
                <Compass className="w-4 h-4 text-bharat-saffron" /> Attractions
              </Link>
              <Link 
                href="/smart-journey" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 bg-amber-50/80 border border-amber-200/60 rounded-xl text-stone-900 font-semibold flex items-center gap-2"
              >
                <Route className="w-4 h-4 text-bharat-saffron" /> Plan Trip
              </Link>
              <Link 
                href="/trips" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 bg-stone-50 hover:bg-stone-100 rounded-xl text-stone-800 flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-bharat-saffron" /> My Trips
              </Link>
              <Link 
                href="/hotels" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 bg-stone-50 hover:bg-stone-100 rounded-xl text-stone-800 flex items-center gap-2"
              >
                <HotelIcon className="w-4 h-4 text-bharat-saffron" /> Hotels Near Sights
              </Link>
              <Link 
                href="/transport" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 bg-stone-50 hover:bg-stone-100 rounded-xl text-stone-800 flex items-center gap-2"
              >
                <Train className="w-4 h-4 text-bharat-saffron" /> Transport Hub
              </Link>
            </div>

            <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 px-1 pt-2">
              Tools & Community
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-medium">
              <Link 
                href="/ai-planner" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 bg-orange-50 rounded-xl text-bharat-saffron font-bold flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-bharat-saffron" /> AI Synthesizer
              </Link>
              <Link 
                href="/wallet" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 bg-stone-50 rounded-xl text-stone-700 flex items-center gap-2"
              >
                <Wallet className="w-3.5 h-3.5 text-stone-400" /> Digital Wallet
              </Link>
              <Link 
                href="/passport" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 bg-stone-50 rounded-xl text-stone-700 flex items-center gap-2"
              >
                <Award className="w-3.5 h-3.5 text-stone-400" /> Bharat Passport
              </Link>
              <Link 
                href="/vendor" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 bg-stone-50 rounded-xl text-stone-700 flex items-center gap-2"
              >
                <HotelIcon className="w-3.5 h-3.5 text-stone-400" /> Vendor Extranet
              </Link>
            </div>
          </div>

          <div className="pt-2 border-t border-stone-100">
            {user ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-stone-800">{user.name}</p>
                  <p className="text-xs text-stone-500">{user.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link 
                    href="/bookings" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-1.5 text-xs font-semibold bg-stone-100 rounded-md"
                  >
                    My Bookings
                  </Link>
                  <button onClick={handleLogout} className="text-xs text-red-600 font-semibold px-2 py-1.5">
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  href="/login" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-1/2 text-center py-2.5 text-sm font-semibold border border-stone-300 rounded-xl"
                >
                  Sign In
                </Link>
                <Link 
                  href="/login?mode=signup" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-1/2 text-center py-2.5 text-sm font-semibold bg-bharat-saffron text-white rounded-xl"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Community Suggest A Place Modal */}
      <SuggestPlaceModal
        isOpen={suggestModalOpen}
        onClose={() => setSuggestModalOpen(false)}
      />
    </header>
  );
}
