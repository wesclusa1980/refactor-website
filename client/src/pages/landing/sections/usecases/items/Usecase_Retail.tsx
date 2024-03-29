import React from 'react';

// Swiper Slider
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';

// Images
import item1 from '../../../../../assets/images//portfolio/items/item2.jpg';
import item2 from '../../../../../assets/images//portfolio/items/item2.jpg';
import item3 from '../../../../../assets/images//portfolio/items/item2.jpg';

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
              <img src={item1} alt="portfolio item 1" style={{ width: '75%' }} />
            </SwiperSlide>

            <SwiperSlide>
              <img src={item2} alt="portfolio item 1" style={{ width: '75%' }} />
            </SwiperSlide>
            <SwiperSlide>
              <img src={item3} alt="portfolio item 1" style={{ width: '75%' }} />
            </SwiperSlide>
          </Swiper>
        </div>

        <h2 className="title">LOYALTY</h2>

        <p className="section-des">
          HEADER
        </p>

        <p className="content-640">
          TEXT
        </p>
      </div>
    </div>
  );
}

export default PortfolioItem1;
