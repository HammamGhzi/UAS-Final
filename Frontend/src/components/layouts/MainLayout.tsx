import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Menu, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../stores/useAuthStore';

const MainLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('beranda');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const isHome = location.pathname === '/';
  const isProductDetail = location.pathname.startsWith('/produk/');

  useEffect(() => {
    if (!isHome) return;

    const updateActiveSection = () => {
      const scrollY = window.scrollY;
      const sanggarTop = document.getElementById('sanggar-section')?.offsetTop ?? Infinity;
      const katalogTop = document.getElementById('katalog-section')?.offsetTop ?? Infinity;
      const tentangTop = document.getElementById('tentang-section')?.offsetTop ?? Infinity;
      const triggerPoint = scrollY + window.innerHeight * 0.38;

      if (triggerPoint >= tentangTop) {
        setActiveSection('tentang');
      } else if (triggerPoint >= katalogTop) {
        setActiveSection('katalog');
      } else if (triggerPoint >= sanggarTop) {
        setActiveSection('sanggar');
      } else {
        setActiveSection('beranda');
      }
    };

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);

    return () => {
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
    };
  }, [isHome]);

  const scrollToTop = () => {
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollTo = (id: string) => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleUserLogout = () => {
    logout();
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Navbar */}
      <nav
        className={`z-50 backdrop-blur-md ${
          location.pathname === '/'
            ? 'fixed top-0 left-0 w-full bg-transparent'
            : isProductDetail
              ? 'sticky top-0 bg-[#fff6e3]/95 border-b border-[#eadfc9]'
              : 'sticky top-0 bg-cream-100/95 border-b border-cream-200'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="text-2xl font-serif font-bold text-black z-10">
              CANTING
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2">
              <div className="flex items-center gap-1 bg-white/[0.14] backdrop-blur-xl border border-black/10 rounded-full px-1.5 py-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
                <Link
                  to="/"
                  onClick={(e) => {
                    if (isHome) {
                      e.preventDefault();
                      scrollToTop();
                    }
                  }}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    isHome && activeSection === 'beranda'
                      ? 'bg-white/80 text-black shadow-sm'
                      : 'text-black/75 hover:text-black'
                  }`}
                >
                  Beranda
                </Link>
                <button
                  onClick={() => scrollTo('sanggar-section')}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    isHome && activeSection === 'sanggar'
                      ? 'bg-white/80 text-black shadow-sm'
                      : 'text-black/75 hover:text-black'
                  }`}
                >
                  Daftar Sanggar
                </button>
                <button
                  onClick={() => scrollTo('katalog-section')}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    isHome && activeSection === 'katalog'
                      ? 'bg-white/80 text-black shadow-sm'
                      : 'text-black/75 hover:text-black'
                  }`}
                >
                  Katalog
                </button>
                <button
                  onClick={() => scrollTo('tentang-section')}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    isHome && activeSection === 'tentang'
                      ? 'bg-white/80 text-black shadow-sm'
                      : 'text-black/75 hover:text-black'
                  }`}
                >
                  Tentang
                </button>
              </div>
            </div>

            <div className="relative z-10 hidden md:block">
              {isAuthenticated ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsUserMenuOpen((current) => !current)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition-colors hover:bg-[#432f27]"
                    aria-label="Menu akun"
                  >
                    <User size={18} />
                  </button>
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="absolute right-0 top-12 w-44 overflow-hidden rounded-xl border border-cream-200 bg-white shadow-lg"
                      >
                        <div className="border-b border-cream-200 px-4 py-3 text-sm font-medium text-brown-900">
                          {user?.email || 'User'}
                        </div>
                        <button
                          type="button"
                          onClick={handleUserLogout}
                          className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                        >
                          <LogOut size={16} />
                          Sign out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link
                  to="/form/login"
                  className="flex items-center px-6 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-[#432f27] transition-colors"
                >
                  Masuk
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-brown-800 z-10"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-cream-100 border-b border-cream-200"
            >
              <div className="px-4 py-2 space-y-1">
                <Link
                  to="/"
                  onClick={(e) => {
                    if (isHome) {
                      e.preventDefault();
                      scrollToTop();
                    } else {
                      setIsMenuOpen(false);
                    }
                  }}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isHome && activeSection === 'beranda'
                      ? 'text-brown-900 bg-cream-200/60'
                      : 'text-brown-800 hover:text-brown-900 hover:bg-cream-50'
                  }`}
                >
                  Beranda
                </Link>
                <button
                  onClick={() => scrollTo('sanggar-section')}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                    isHome && activeSection === 'sanggar'
                      ? 'text-brown-900 bg-cream-200/60'
                      : 'text-brown-800 hover:text-brown-900 hover:bg-cream-50'
                  }`}
                >
                  Daftar Sanggar
                </button>
                <button
                  onClick={() => scrollTo('katalog-section')}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                    isHome && activeSection === 'katalog'
                      ? 'text-brown-900 bg-cream-200/60'
                      : 'text-brown-800 hover:text-brown-900 hover:bg-cream-50'
                  }`}
                >
                  Katalog
                </button>
                <button
                  onClick={() => scrollTo('tentang-section')}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                    isHome && activeSection === 'tentang'
                      ? 'text-brown-900 bg-cream-200/60'
                      : 'text-brown-800 hover:text-brown-900 hover:bg-cream-50'
                  }`}
                >
                  Tentang
                </button>
                {isAuthenticated ? (
                  <button
                    type="button"
                    onClick={handleUserLogout}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-red-600 font-medium"
                  >
                    <LogOut size={18} />
                    Sign out
                  </button>
                ) : (
                  <Link
                    to="/form/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 text-brown-800 font-medium"
                  >
                    Masuk
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <Outlet />

      {/* Footer */}
      <footer className="bg-white text-brown-900 py-12 border-t border-cream-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-serif font-bold mb-4 text-brown-900">CANTING</h3>
              <p className="text-brown-600 text-sm">
                Temukan Batik Tegalan terbaik dengan rekomendasi cerdas berdasarkan jarak dan jenis batik pilihanmu.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-brown-900">Product</h4>
              <ul className="space-y-2 text-sm text-brown-600">
                <li>
                  <button onClick={() => scrollTo('katalog-section')} className="hover:text-brown-900">
                    Katalog
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollTo('sanggar-section')} className="hover:text-brown-900">
                    Daftar Sanggar
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollTo('rekomendasi-section')} className="hover:text-brown-900">
                    Rekomendasi
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-brown-900">Company</h4>
              <ul className="space-y-2 text-sm text-brown-600">
                <li>
                  <button onClick={() => scrollTo('tentang-section')} className="hover:text-brown-900">
                    Tentang
                  </button>
                </li>
                <li><a href="#" className="hover:text-brown-900">Kontak</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-brown-900">Kontak</h4>
              <ul className="space-y-2 text-sm text-brown-600">
                <li>📧 info@canting.id</li>
                <li>📱 (0283) 123456</li>
                <li>📍 Tegal, Jawa Tengah</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-cream-200 mt-8 pt-8 text-center text-sm text-brown-500">
            <p>© 2026 CANTING. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;