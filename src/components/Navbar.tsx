import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-scroll';
import LangToggle from './LangToggle';

const links = ['about', 'education', 'experience', 'projects', 'skills', 'contact'];

export default function Navbar() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          to="hero"
          smooth
          spy
          offset={-100}
          className="font-display text-xl font-semibold text-slate-900 cursor-pointer select-none"
        >
          TW
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((key) => (
            <Link
              key={key}
              to={key}
              smooth
              spy
              offset={-80}
              activeClass="text-accent-600"
              className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer capitalize"
            >
              {t(`nav.${key}`)}
            </Link>
          ))}
          <a
            href="/driving/"
            className="text-sm font-medium text-accent-600 hover:text-accent-700 transition-colors"
          >
            {t('nav.driving')}
          </a>
          <LangToggle />
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-px bg-slate-700 transition-transform ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
          <span className={`block w-5 h-px bg-slate-700 transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-px bg-slate-700 transition-transform ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 px-6 pb-4 pt-2 flex flex-col gap-3">
          {links.map((key) => (
            <Link
              key={key}
              to={key}
              smooth
              spy
              offset={-80}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors capitalize py-1"
            >
              {t(`nav.${key}`)}
            </Link>
          ))}
          <a
            href="/driving/"
            onClick={() => setMenuOpen(false)}
            className="text-sm font-medium text-accent-600 hover:text-accent-700 transition-colors py-1"
          >
            {t('nav.driving')}
          </a>
          <div className="pt-2">
            <LangToggle />
          </div>
        </div>
      )}
    </nav>
  );
}
