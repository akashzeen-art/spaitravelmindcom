import { Link } from 'react-router-dom';
import { useAppLanguage } from '../context/AppLanguageContext';

export default function Footer({ visible }) {
  const { t } = useAppLanguage();

  return (
    <div className={`footer text-center fixed-bottom index5${visible ? '' : ' d-none'}`}>
      <div className="container">
        <nav className="footer__nav" aria-label="Footer">
          <Link to="/cities">{t.cities}</Link>
          <Link to="/countries">{t.countries}</Link>
        </nav>
        <p className="footer__copy mb-0">
          {t.copyright(new Date().getFullYear())}{' '}
          <Link to="/">Trip XAI</Link>
        </p>
      </div>
    </div>
  );
}
