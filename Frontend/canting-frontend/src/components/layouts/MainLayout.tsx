import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MainLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const scrollTo = (id: string) => {
    setIsMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-cream-100/95 backdrop-blur-sm border-b border-cream-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="text-2xl font-serif font-bold text-brown-900">
              CANTING
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={`text-sm font-medium transition-colors ${
                  location.pathname === '/' ? 'text-lime-600' : 'text-brown-800 hover:text-lime-600'
                }`}
              >
                Beranda
              </Link>
              <button
                onClick={() => scrollTo('katalog-section')}
                className="text-sm font-medium transition-colors text-brown-800 hover:text-lime-600"
              >
                Katalog
              </button>
              <button
                onClick={() => scrollTo('sanggar-section')}
                className="text-sm font-medium transition-colors text-brown-800 hover:text-lime-600"
              >
                Daftar Sanggar
              </button>
              <Link
                to="/tentang"
                className={`text-sm font-medium transition-colors ${
                  location.pathname === '/tentang' ? 'text-lime-600' : 'text-brown-800 hover:text-lime-600'
                }`}
              >
                Tentang
              </Link>
              <Link
                to="/admin/login"
                className="flex items-center gap-2 px-4 py-2 bg-brown-900 text-cream-50 rounded-full text-sm font-medium hover:bg-brown-800 transition-colors"
              >
                <User size={16} />
                Masuk
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-brown-800"
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
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === '/'
                      ? 'text-lime-600 bg-lime-50'
                      : 'text-brown-800 hover:text-lime-600 hover:bg-cream-50'
                  }`}
                >
                  Beranda
                </Link>
                <button
                  onClick={() => scrollTo('katalog-section')}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-brown-800 hover:text-lime-600 hover:bg-cream-50"
                >
                  Katalog
                </button>
                <button
                  onClick={() => scrollTo('sanggar-section')}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-brown-800 hover:text-lime-600 hover:bg-cream-50"
                >
                  Daftar Sanggar
                </button>
                <Link
                  to="/tentang"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === '/tentang'
                      ? 'text-lime-600 bg-lime-50'
                      : 'text-brown-800 hover:text-lime-600 hover:bg-cream-50'
                  }`}
                >
                  Tentang
                </Link>
                <Link
                  to="/admin/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-brown-800 font-medium"
                >
                  Masuk
                </Link>
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
                  <Link to="/rekomendasi" className="hover:text-brown-900">Rekomendasi</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-brown-900">Company</h4>
              <ul className="space-y-2 text-sm text-brown-600">
                <li><Link to="/tentang" className="hover:text-brown-900">Tentang</Link></li>
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