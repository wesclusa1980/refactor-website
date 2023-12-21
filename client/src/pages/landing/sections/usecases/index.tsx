import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

// Plugins
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

// UI Components
import PortfolioItem1 from './items/Usecase_Retail';
import PortfolioItem2 from './items/PortfolioItem2';
import PortfolioItem3 from './items/UseCase_Hospitality';

// Images
import portfolio1 from '../../../../assets/images/portfolio/portfolio1.jpg';
import portfolio2 from '../../../../assets/images/portfolio/portfolio2.jpg';
import portfolio3 from '../../../../assets/images/portfolio/portfolio3.jpg';
import portfolio4 from '../../../../assets/images/portfolio/portfolio4.jpg';
import portfolio5 from '../../../../assets/images/portfolio/portfolio5.jpg';

import backArrow from '../../../../assets/images/close-left-arrow.png';
import closeIcon from '../../../../assets/images/close.png';

// Styles
import './style.css';

// Data
import portfolioData from '../../../../data/usecases.json';

function UseCases() {
  const { industry } = useParams();
  const images = [portfolio1, portfolio2, portfolio3, portfolio4, portfolio5];

  const [portfolioItem, setPortfolioItem] = useState(0);
  const [openPortfolio, setOpenPortfolio] = useState(0);

  const handleOpenItem = (num) => {
    const element = document.getElementById('portfolio-wrapper');
    if (element) {
      element.scrollIntoView();
    }
    setPortfolioItem(num);
  };

  const handlCloseItem = () => {
    setPortfolioItem(0);
  };

  const handleOpenPopup = (num) => {
    setOpenPortfolio(num);
  };

  const handleClosePopup = () => {
    setOpenPortfolio(0);
  };

  // Example of conditional rendering based on industry
  const renderIndustrySpecificContent = () => {
    switch (industry) {
      case 'retail':
        return <div>Retaillll specific content here</div>;
      case 'hospitality':
        return <div>Hospitality specific content here</div>;
      default:
        return <div>Please select an industry above</div>;
    }
  };

  return (
    <section id="usecases" className="section">
      <h2 className="title">{`Use Cases`}</h2>
      <div className="section-des">{portfolioData.description}</div>

      {renderIndustrySpecificContent()}

      <div id="portfolio-wrapper" className="relative block-right">
        {portfolioItem === 0 ? (
          <div className="grid" id="portfolio-grid">
            <div className="grid-sizer"></div>
            {portfolioData.portfolioItems.map((item, i: number) => (
              <div
                key={'port-item-' + i}
                className={'grid-item element-item ' + item.gridSize}>
                <a
                  className="item-link"
                  onClick={() => {
                    // according to action type we wil fire the function
                    if (
                      item?.action?.type === 'item' &&
                      typeof item?.action?.number === 'number'
                    ) {
                      handleOpenItem(item.action.number);
                    } else if (
                      item?.action?.type === 'popup' &&
                      typeof item?.action?.number === 'number'
                    ) {
                      handleOpenPopup(item.action.number);
                    }
                  }}>
                  <img src={images[i]} alt="portfolio image" />
                  <div className="portfolio-text-holder">
                    <div className="portfolio-text-wrapper">
                      <p className="portfolio-text">{item.description.text}</p>
                      <p className="portfolio-cat">
                        {item.description.caption}
                      </p>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        ) : (
          // Portfolio items to be opened as a separate component
          <div className="portfolio-load-content-holder">
            <div className="close-icon" role="button" onClick={handlCloseItem}>
              <img src={backArrow} alt="back arrow" />
            </div>
            {portfolioItem === 1 ? (
              <PortfolioItem1 />
            ) : portfolioItem === 2 ? (
              <PortfolioItem2 />
            ) : portfolioItem === 3 ? (
              <PortfolioItem3 />
            ) : (
              <></>
            )}
          </div>
        )}
      </div>
      {/* Popups portfolio items */}
      <Popup
        open={openPortfolio !== 0}
        closeOnDocumentClick
        onClose={handleClosePopup}
        modal>
        <div className="my-popup">
          <div
            className="close-popup-btn"
            role="button"
            onClick={handleClosePopup}>
            <img src={closeIcon} alt="close icon" />
          </div>
          {openPortfolio === 1 ? (
            <p className="block-right poped-up-item" onClick={close}>
              <iframe
                src="https://player.vimeo.com/video/199192931"
                width="100%"
                allow="autoplay; fullscreen"></iframe>
            </p>
          ) : openPortfolio === 2 ? (
            <div className="popup-image-box">
              <img src={portfolio5} alt="portfolio image" />
            </div>
          ) : (
            <></>
          )}
        </div>
      </Popup>
    </section>
  );
}

export default UseCases;
