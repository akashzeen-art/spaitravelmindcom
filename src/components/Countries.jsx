import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { countries as countryData, formatLanguageLabels } from '../data/destinations';
import { useAppLanguage } from '../context/AppLanguageContext';

const GoArrow = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="56"
    height="66"
    viewBox="0 0 139 120"
    aria-hidden="true"
  >
    <path
      fill="currentColor"
      d="M80.2 8.2c-2.2-2.1-5.7-2-7.8.2-2.1 2.2-2 5.7.2 7.8l34.2 38.1H6c-3.1 0-5.6 2.5-5.6 5.6S2.9 65.5 6 65.5h100.8L72.6 103.6c-2.2 2.1-2.3 5.6-.2 7.8 2.1 2.2 5.6 2.3 7.8.2l50.6-50c2.4-2.7 2.4-6.9 0-9.6L80.2 8.2z"
    />
  </svg>
);

function CountryCard({ country, langNames }) {
  return (
    <Link to={`/guide/${country.id}`} className="slider-card-link">
      <div
        className="slider-card"
        style={{ backgroundImage: `url(${country.image})` }}
      >
        <div className="slider-card__shade" aria-hidden="true" />
        <div className="country_info_box">
          <div className="country_name">{country.name}</div>
          <div className="country_button" aria-hidden="true">
            <GoArrow className="go_arrow_in" />
            <GoArrow className="go_arrow" />
          </div>
          <div className="country_langs">{formatLanguageLabels(country, langNames)}</div>
        </div>
      </div>
    </Link>
  );
}

export default function Countries() {
  const { t } = useAppLanguage();
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <section
      className="home-section container-fluid relative index5 px-0 mx-0 countries"
      aria-labelledby="countries-heading"
    >
      <div className="container">
        <div className="home-section__header">
          <div className="home-section__copy">
            <p className="home-section__kicker">{t.planTheJourney}</p>
            <h2 id="countries-heading" className="title home-section__title">
              {t.countries}
            </h2>
            <p className="home-section__lead d-none d-md-block">
              {t.countriesLead(countryData.length)}
            </p>
          </div>
          <Link
            to="/countries"
            className="moreButton home-section__more d-none d-md-inline-flex"
          >
            {t.viewAllCountries}
          </Link>
        </div>
      </div>

      <div className="container-fluid countries__slider-wrap py-lg-4 mt-3 mt-md-4">
        <div className="row position-relative country-slider-box align-items-center">
          <div className="col-12 countries__slider-col px-0">
            <div className="countries__nav">
              <button
                ref={prevRef}
                type="button"
                className="countries__nav-btn countries__nav-btn--prev"
                aria-label="Previous countries"
              >
                ‹
              </button>
              <button
                ref={nextRef}
                type="button"
                className="countries__nav-btn countries__nav-btn--next"
                aria-label="Next countries"
              >
                ›
              </button>
            </div>

            <Swiper
              className="slider2 countries-swiper"
              modules={[Navigation, Pagination, Autoplay]}
              loop={countryData.length > 3}
              centeredSlides
              grabCursor
              speed={650}
              spaceBetween={12}
              slidesPerView={1.15}
              autoplay={{
                delay: 4200,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              pagination={{ clickable: true }}
              breakpoints={{
                0: { slidesPerView: 1.15, spaceBetween: 10, centeredSlides: true },
                600: { slidesPerView: 2.1, spaceBetween: 14, centeredSlides: true },
                992: { slidesPerView: 2.6, spaceBetween: 16, centeredSlides: true },
                1300: { slidesPerView: 3.25, spaceBetween: 18, centeredSlides: true },
              }}
              onBeforeInit={(swiper) => {
                if (!swiper?.params?.navigation) return;
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
              }}
              onSwiper={(swiper) => {
                setTimeout(() => {
                  if (!swiper?.params?.navigation || !swiper.navigation) return;
                  swiper.params.navigation.prevEl = prevRef.current;
                  swiper.params.navigation.nextEl = nextRef.current;
                  swiper.navigation.destroy();
                  swiper.navigation.init();
                  swiper.navigation.update();
                });
              }}
            >
              {countryData.map((country) => (
                <SwiperSlide key={country.id}>
                  <CountryCard country={country} langNames={t.langNames} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        <div className="home-section__mobile-cta d-md-none">
          <Link to="/countries" className="moreButton">
            {t.viewAllCountries}
          </Link>
        </div>
      </div>
    </section>
  );
}
