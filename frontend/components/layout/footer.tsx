import Link from "next/link";
import { Train, Phone, Mail, ShieldAlert, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#060911] text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl metro-gradient-bg flex items-center justify-center">
                <Train className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white">Indore <span className="metro-gradient-text">Metro</span></span>
            </div>
            <p className="text-sm leading-relaxed">
              Madhya Pradesh Metro Rail Corporation Limited (MPMRCL) - Official Digital Ticketing & Passenger Web Platform for Indore City Metro Rail.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Passenger Tools</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/journey" className="hover:text-teal-300 transition">Journey Planner</Link></li>
              <li><Link href="/fare" className="hover:text-teal-300 transition">Fare Calculator</Link></li>
              <li><Link href="/stations" className="hover:text-teal-300 transition">Station Directory</Link></li>
              <li><Link href="/timetable" className="hover:text-teal-300 transition">Train Schedules</Link></li>
              <li><Link href="/alerts" className="hover:text-teal-300 transition">Service Alerts</Link></li>
            </ul>
          </div>

          {/* Guidelines */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Platform Policy</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/help" className="hover:text-teal-300 transition">Help & FAQs</Link></li>
              <li><Link href="/about" className="hover:text-teal-300 transition">About Indore Metro</Link></li>
              <li><Link href="/contact" className="hover:text-teal-300 transition">Contact & Support</Link></li>
              <li><span className="text-slate-500">Terms of Ticketing</span></li>
              <li><span className="text-slate-500">Privacy Policy</span></li>
            </ul>
          </div>

          {/* Helpline & Contact */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Helpline & Security</h4>
            <div className="p-3.5 rounded-xl bg-teal-950/40 border border-teal-500/20 text-sm space-y-2">
              <div className="flex items-center gap-2 text-teal-300 font-medium">
                <Phone className="w-4 h-4 text-teal-400" />
                Metro Helpline: 1800-233-INDORE
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-teal-400" />
                support@indoremetro.gov.in
              </div>
              <div className="flex items-center gap-2 text-rose-400 text-xs">
                <ShieldAlert className="w-4 h-4" />
                Emergency Security Control Room 24x7
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs gap-4">
          <p>&copy; {new Date().getFullYear()} Indore Metro Rail Corporation. Built for Production Excellence.</p>
          <p className="flex items-center gap-1 text-slate-500">
            Designed for Indore City Mass Rapid Transit System
          </p>
        </div>
      </div>
    </footer>
  );
}
