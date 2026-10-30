import { Link } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';

export default function PageLayout({ children, scrolled = true, footerVisible = true }) {
  return (
    <>
      <Navbar scrolled={scrolled} fixed />
      <div className="ai-page">{children}</div>
      <Footer visible={footerVisible} />
    </>
  );
}

export function PageBack({ to, label = 'Back' }) {
  return (
    <Link to={to} className="ai-page__back">
      ← {label}
    </Link>
  );
}

export function PageHero({
  image,
  title,
  tagline,
  backTo = '/',
  backLabel = 'Home',
  badge,
  className = '',
}) {
  return (
    <div
      className={`ai-page__hero${className ? ` ${className}` : ''}`}
      style={{ backgroundImage: image ? `url(${image})` : undefined }}
    >
      <div className="ai-page__hero-overlay" />
      <div className="container ai-page__hero-content">
        <PageBack to={backTo} label={backLabel} />
        {badge && <p className="ai-page__hero-badge">{badge}</p>}
        <h1 className="ai-page__heading">{title}</h1>
        {tagline && <p className="ai-page__tagline">{tagline}</p>}
      </div>
    </div>
  );
}
