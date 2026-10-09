import Link from 'next/link';
import { ShieldCheck, Sparkles } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-[#132238] text-slate-300 pt-16 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="reverse" size="lg" href="/" />
            <p className="text-sm text-slate-300 max-w-sm leading-relaxed pt-2">
              ExploreBharat is a unified platform to discover India&apos;s tourist places, find nearby stays and experiences, plan trips, and book travel services — from free-entry destinations to fully bookable attractions.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-300 bg-[#0A1320]/60 p-3 rounded-lg border border-white/10 max-w-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Official Archaeological Survey of India (ASI) & State Tourism data alignment.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-4">Discover</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/destinations" className="hover:text-bharat-saffron transition-colors">All 36 States & UTs</Link></li>
              <li><Link href="/attractions" className="hover:text-bharat-saffron transition-colors">Historical Forts & Palaces</Link></li>
              <li><Link href="/hotels" className="hover:text-bharat-saffron transition-colors">Heritage Haveli Stays</Link></li>
              <li><Link href="/circuits" className="hover:text-bharat-saffron transition-colors">Golden Triangle Circuit</Link></li>
              <li><Link href="/attractions?filter=hidden" className="hover:text-bharat-saffron transition-colors">Hidden Gems of India</Link></li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/ai-planner" className="hover:text-bharat-saffron transition-colors flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI Trip Planner</Link></li>
              <li><Link href="/trips" className="hover:text-bharat-saffron transition-colors">Deterministic Budget Calculator</Link></li>
              <li><Link href="/bookings" className="hover:text-bharat-saffron transition-colors">Digital QR Tickets</Link></li>
              <li><Link href="/login?mode=vendor" className="hover:text-bharat-saffron transition-colors">Partner & Vendor Portal</Link></li>
              <li><Link href="/admin" className="hover:text-bharat-saffron transition-colors">Admin Governance</Link></li>
            </ul>
          </div>

          {/* Top States */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-4">Iconic Regions</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/destinations?state=RJ" className="hover:text-bharat-saffron transition-colors">Rajasthan</Link></li>
              <li><Link href="/destinations?state=KL" className="hover:text-bharat-saffron transition-colors">Kerala</Link></li>
              <li><Link href="/destinations?state=UP" className="hover:text-bharat-saffron transition-colors">Uttar Pradesh</Link></li>
              <li><Link href="/destinations?state=MH" className="hover:text-bharat-saffron transition-colors">Maharashtra</Link></li>
              <li><Link href="/destinations?state=LA" className="hover:text-bharat-saffron transition-colors">Ladakh</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>© 2026 ExploreBharat. Discover India. Plan Your Journey. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Security Audited</span>
            <span>Razorpay Payment Verified</span>
            <span>PostGIS Geolocation Enabled</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
