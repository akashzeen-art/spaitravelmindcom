import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Cities from '../components/Cities';
import Countries from '../components/Countries';
import Languages from '../components/Languages';
import Stats from '../components/Stats';
import Footer from '../components/Footer';
import { useBackgroundMovement } from '../hooks/useBackgroundMovement';
import { useSiteScroll } from '../hooks/useSiteScroll';

export default function HomePage() {
  useBackgroundMovement();
  const scrolled = useSiteScroll();

  return (
    <>
      <Navbar scrolled={scrolled} />
      <Hero showArrow={!scrolled} />
      <Cities />
      <Countries />
      <Languages />
      <Stats />
      <Footer visible={scrolled} />
    </>
  );
}
