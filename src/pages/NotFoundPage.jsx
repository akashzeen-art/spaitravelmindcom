import { Link } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';

export default function NotFoundPage() {
  return (
    <PageLayout>
      <div className="container empty-state">
        <p className="ai-guide-page__kicker">404</p>
        <h1 className="ai-page__heading" style={{ textAlign: 'center' }}>
          Page not found
        </h1>
        <p className="empty-state__lead">
          That link is not part of Trip XAI. Pick a city, country, or language to continue.
        </p>
        <div className="empty-state__actions">
          <Link to="/" className="moreButton">
            Home
          </Link>
          <Link to="/cities" className="moreButton moreButton--ghost">
            Cities
          </Link>
          <Link to="/countries" className="moreButton moreButton--ghost">
            Countries
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
