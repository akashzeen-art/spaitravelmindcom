import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LanguageToggle from './LanguageToggle';
import { useAppLanguage } from '../context/AppLanguageContext';

export default function Navbar({ scrolled = false, fixed = false }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { t } = useAppLanguage();
  const isHome = location.pathname === '/';
  const showGradient = fixed || scrolled || !isHome;

  const menuLinks = [
    { label: t.home, to: '/' },
    { label: t.cities, to: '/cities' },
    { label: t.countries, to: '/countries' },
    { label: t.languages, to: '/languages' },
  ];

  const toggleMenu = () => setIsMenuOpen((open) => !open);
  const closeMenu = () => setIsMenuOpen(false);

  const navClass = `container-fluid ${fixed || !isHome ? 'position-fixed' : 'position-absolute'} index6 navbox${showGradient ? ' gradient_bg' : ''}`;

  return (
    <>
      <div className={navClass}>
        <div className="container">
          <div className="tx-nav">
            <Link className="tx-nav__brand" to="/" onClick={closeMenu}>
              <img className="logo" src="/images/logo.png" alt="Trip XAI" />
            </Link>

            <button
              className="navbar-toggler custom-toggler tx-nav__menu-btn"
              type="button"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>
          </div>
        </div>
      </div>

      <div className={`collapse${isMenuOpen ? ' show' : ''}`} id="navbarToggleExternalContent">
        <div className="bg-dark" style={{ backgroundPositionX: '-1706.2px' }}>
          <div className="container-fluid position-absolute index6 navbox gradient_bg">
            <div className="container index6">
              <div className="tx-nav">
                <Link className="tx-nav__brand" to="/" onClick={closeMenu}>
                  <img className="logo" src="/images/logo.png" alt="Trip XAI" />
                </Link>

                <button
                  className="navbar-toggler custom-toggler tx-nav__menu-btn"
                  type="button"
                  onClick={toggleMenu}
                  aria-expanded={isMenuOpen}
                  aria-label="Toggle navigation"
                >
                  <span className="navbar-toggler-icon" />
                </button>
              </div>

              <div className="nav-menu-lang">
                <p className="nav-menu-lang__label">{t.guideLanguage}</p>
                <LanguageToggle />
              </div>

              {menuLinks.map((link) => (
                <Link key={link.to} to={link.to} className="menu_button" onClick={closeMenu}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
