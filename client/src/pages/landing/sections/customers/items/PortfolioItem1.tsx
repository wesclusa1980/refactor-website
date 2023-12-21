import React from 'react';

// Swiper Slider
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';

// Images
import item1 from '../../../../../assets/images//portfolio/items/item1.jpg';
import item2 from '../../../../../assets/images//portfolio/items/item2.jpg';
import item3 from '../../../../../assets/images//portfolio/items/item3.jpg';

// Styles
import './style.css';

// -------------------

function PortfolioItem1() {
  return (
    <div className="portfolio-item-wrapper">
      <div className="portfolio-content">
        <div className="image-slider-wrapper relative block-right">
          <Swiper
            pagination={{ clickable: true }}
            loop={true}
            modules={[Pagination]}
            className="portfolio-slider">
            <SwiperSlide>
              <img src={item1} alt="portfolio item 1" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={item2} alt="portfolio item 1" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={item3} alt="portfolio item 1" />
            </SwiperSlide>
          </Swiper>
        </div>

        <h2 className="title">ART OF CAMERA</h2>

        <p className="section-des">
          Two ghostly white figures in coveralls and helmets are softly dancing.
        </p>

        <p className="content-670">
          Cras pretium metus pulvinar ultricies auctor. In varius purus blandit
          sem mollis tristique. Curabitur sed lorem vel ligula pulvinar
          porttitor. Proin sit amet mauris eleifend amet, ullamcorper lacus.
          Vangelis rich in heavy atoms descended from astronomers dream of the
          mind’s cras pretium metus pulvinar ultricies auctor in varius purus
          blandit.
        </p>
      </div>
    </div>
  );
}

export default PortfolioItem1;
