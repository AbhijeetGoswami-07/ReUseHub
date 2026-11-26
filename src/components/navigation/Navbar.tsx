import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { Logo } from '@/components/common/Logo';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { cn } from '@/utils/cn';
import { Menu, X, User, ShieldCheck, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (path: string) => {
    setMobileMenuOpen(false);
    if (path.startsWith('/#')) {
      const targetId = path.replace('/#', '');
      if (location.pathname !== '/') {
        navigate(`/${path}`);
      } else {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      navigate(path);
    }
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Discover', path: '/discover' },
    { name: 'Analyze Product', path: '/analyzer' },
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'EcoScore', path: '/ecoscore' },
    { name: 'How It Works', path: '/#how-it-works' },
    { name: 'About', path: '/#about' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-brand-bg/90 backdrop-blur-md border-b border-brand-border/80 shadow-soft-xs transition-colors">
        <Container size="xl">
          <div className="flex items-center justify-between h-20 gap-2">
            {/* Left: ReUseHub Logo */}
            <Link
              to="/"
              className="flex items-center group focus:outline-none focus:ring-2 focus:ring-brand-primary/40 rounded-xl p-1 transition-transform duration-200 hover:scale-[1.02] shrink-0"
            >
              <Logo size="md" variant="full" />
            </Link>

            {/* Center Navigation */}
            <nav className="hidden lg:flex items-center gap-0.5 bg-forest-100/40 p-1 rounded-2xl border border-brand-border/40 shrink-0">
              {navItems.map((item) => {
                const isAnchor = item.path.startsWith('/#');
                const isActive = !isAnchor && location.pathname === item.path;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => handleNavClick(item.path)}
                    className={cn(
                      'px-2 xl:px-2.5 py-1.5 rounded-xl text-xs xl:text-sm font-medium whitespace-nowrap transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-brand-primary/30 relative',
                      isActive
                        ? 'text-brand-primary font-semibold bg-white shadow-soft-xs border border-brand-border/60'
                        : 'text-brand-muted hover:text-brand-primary hover:bg-white/60'
                    )}
                  >
                    {item.name}
                  </button>
                );
              })}
            </nav>

            {/* Right: Login & Get Started */}
            <div className="hidden md:flex items-center gap-1.5 xl:gap-2 shrink-0">
              {profile && (profile.role === 'admin' || profile.email.toLowerCase().includes('admin')) && (
                <Link to="/admin">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-emerald-600/30 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 text-xs"
                    leftIcon={<ShieldCheck className="w-4 h-4 text-emerald-600" />}
                  >
                    Admin
                  </Button>
                </Link>
              )}

              {profile ? (
                <Link to="/profile">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    leftIcon={<User className="w-4 h-4 text-brand-secondary" />}
                  >
                    {profile.fullName ? profile.fullName.split(' ')[0] : 'Profile'}
                  </Button>
                </Link>
              ) : (
                <Link to="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    leftIcon={<User className="w-4 h-4 text-brand-secondary" />}
                  >
                    Login
                  </Button>
                </Link>
              )}

              <Link to="/analyzer">
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Sparkles className="w-3.5 h-3.5 text-sage-300 group-hover:rotate-12 transition-transform duration-300 shrink-0" />}
                  className="shadow-sm group !inline-flex !flex-row !flex-nowrap !items-center gap-1.5 whitespace-nowrap text-xs font-semibold px-3.5 h-9"
                >
                  <span className="text-white font-semibold inline-block whitespace-nowrap">Get Started</span>
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex lg:hidden items-center gap-2">
              <Link to="/analyzer" className="sm:hidden">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-brand-text hover:bg-forest-100 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </Container>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-brand-border bg-brand-bg px-4 pt-3 pb-6 space-y-2 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => handleNavClick(item.path)}
                  className="px-3.5 py-2.5 rounded-xl text-sm font-medium text-left text-brand-text hover:bg-forest-100 transition-colors"
                >
                  {item.name}
                </button>
              ))}
            </div>

            <div className="pt-4 mt-2 border-t border-brand-border flex flex-col gap-2">
              {profile && (profile.role === 'admin' || profile.email.toLowerCase().includes('admin')) && (
                <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="md" className="w-full justify-center border-emerald-500 text-emerald-800 bg-emerald-50">
                    Admin Console
                  </Button>
                </Link>
              )}

              {profile ? (
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="md" className="w-full justify-center">
                    My Account ({profile.fullName})
                  </Button>
                </Link>
              ) : (
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="md" className="w-full justify-center">
                    Login
                  </Button>
                </Link>
              )}
              <Link to="/analyzer" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" size="md" className="w-full justify-center">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
};
