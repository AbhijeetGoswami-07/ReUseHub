import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '@/components/common/Container';
import { Logo } from '@/components/common/Logo';
import {
  Repeat,
  Wrench,
  Sparkles,
  HeartHandshake,
  Recycle,
  Globe,
  Leaf,
  CheckCircle2,
  Mail,
  MapPin,
  ExternalLink,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const pathways = [
    { name: '1. Reuse', desc: 'Direct repurposing without alteration', icon: Repeat, path: '/discover?action=reuse' },
    { name: '2. Repair', desc: 'Restoring damaged items to service', icon: Wrench, path: '/discover?action=repair' },
    { name: '3. Upcycle', desc: 'Transforming materials into higher utility', icon: Sparkles, path: '/discover?action=upcycle' },
    { name: '4. Donate', desc: 'Passing useful goods to community members', icon: HeartHandshake, path: '/marketplace' },
    { name: '5. Recycle', desc: 'Responsible material reclamation', icon: Recycle, path: '/discover?action=recycle' },
  ];

  return (
    <footer className="bg-brand-primary text-cream/90 pt-16 pb-12 border-t border-forest-800">
      <Container size="xl">
        {/* Top 5 Pathways Banner */}
        <div className="mb-14 pb-12 border-b border-forest-800/80">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 text-left">
            <div>
              <span className="text-xs uppercase tracking-widest text-sage-300 font-semibold flex items-center gap-2">
                <Leaf className="w-3.5 h-3.5" />
                The Circular Economy Hierarchy
              </span>
              <h3 className="text-2xl font-display font-bold text-white mt-1">
                Five Pathways to Prevent Waste
              </h3>
            </div>
            <p className="text-sm text-forest-200 max-w-md">
              Every item has value. Prioritizing reuse and repair over disposal maximizes carbon avoidance and preserves virgin natural resources.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {pathways.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className="block h-full text-left focus:outline-none group"
                >
                  <div
                    className="h-full p-4 rounded-xl bg-[#143322] hover:bg-[#1a402b] border border-white/10 hover:border-emerald-400/50 shadow-soft-xs transition-all duration-200 text-left"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#234B35] flex items-center justify-center text-emerald-300 group-hover:bg-emerald-600 group-hover:text-white transition-colors mb-3 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-bold text-white group-hover:text-emerald-200 transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-xs text-forest-200 mt-1.5 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Main Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-forest-800 text-left">
          {/* Brand Info & Sustainability Message */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <Logo size="md" variant="full" theme="light" />
            </Link>
            <p className="text-xs sm:text-sm text-forest-200 leading-relaxed max-w-sm">
              ReUseHub is an environmental studies software project dedicated to identifying sustainable alternative uses for unwanted items, connecting local circular communities, and measuring verified ecological impact.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-2.5 text-xs text-sage-300">
              <span className="flex items-center gap-1.5 bg-forest-800/80 px-3 py-1.5 rounded-full border border-forest-700">
                <Globe className="w-3.5 h-3.5" />
                Zero-Waste Platform
              </span>
              <span className="flex items-center gap-1.5 bg-forest-800/80 px-3 py-1.5 rounded-full border border-forest-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Verified LCA Calculations
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-forest-200">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/discover" className="hover:text-white transition-colors">
                  Discover Ideas
                </Link>
              </li>
              <li>
                <Link to="/analyzer" className="hover:text-white transition-colors">
                  Product Analyzer
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="hover:text-white transition-colors">
                  Second-Hand Marketplace
                </Link>
              </li>
              <li>
                <Link to="/community" className="hover:text-white transition-colors">
                  Repair Community
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  Impact Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Project Information */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Project Information
            </h4>
            <ul className="space-y-2 text-xs text-forest-300 leading-relaxed">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sage-300" />
                Environmental Studies Project
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sage-300" />
                Product Reuse System
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sage-300" />
                Target: Households & Students
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sage-300" />
                Stack: React, TypeScript, Vite
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sage-300" />
                Database: Supabase PostgreSQL
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Contact & Support
            </h4>
            <div className="space-y-3 text-xs text-forest-200">
              <p className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-sage-300 shrink-0 mt-0.5" />
                <span>support@reusehub.org</span>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-sage-300 shrink-0 mt-0.5" />
                <span>Environmental Technology Lab, University Campus</span>
              </p>
              <div className="pt-2">
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1.5 text-sage-300 hover:text-white font-semibold transition-colors"
                >
                  <span>System Diagnostics Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sustainability Message & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-forest-300 gap-4 text-left">
          <p>
            &copy; {new Date().getFullYear()} ReUseHub. Give Every Product a Second Life. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/discover" className="hover:text-white transition-colors">
              Methodology
            </Link>
            <Link to="/community" className="hover:text-white transition-colors">
              Ethics & Guidelines
            </Link>
            <Link to="/design-system" className="hover:text-white transition-colors">
              Design System
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};
