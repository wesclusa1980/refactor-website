import React, { useEffect, useState, useCallback } from 'react';

// Plugins
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

// UI Components
import PortfolioItem1 from './items/PortfolioItem1';
import PortfolioItem2 from './items/PortfolioItem2';
import PortfolioItem3 from './items/PortfolioItem3';

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
import portfolioData from '../../../../data/customers.json';

// --------------

function Customers() {
  const images: string[] = [
    portfolio1,
    portfolio2,
    portfolio3,
    portfolio4,
    portfolio5,
  ];

  // Portfolio item to be shown (change rendered different components in item folder)
  const [portfolioItem, setPortfolioItem] = useState<number>(0);
  // Portfolio item to be shown as a popup
  const [openPortfolio, setOpenPortfolio] = useState<number>(0);

  /**
   * Opening portfolio item that the user clicked
   *
   * @param num portfolio item to be open
   */
  const handleOpenItem = (num: number) => {
    const element: HTMLElement | null =
      document.getElementById('portfolio-wrapper');
    if (element) {
      element.scrollIntoView();
    }

    setPortfolioItem(num);
  };

  /**
   * Close Opened portfolio item and show the portfolio grid images
   */
  const handlCloseItem = () => {
    setPortfolioItem(0);
  };

  /**
   * Open a popup of the item with the given number passed to the function
   *
   * @param num Pop up item number to be open
   */
  const handleOpenPopup = (num: number) => {
    setOpenPortfolio(num);
  };

  /**
   * Closed the opened items by reseting the {openPortfolio} variable to 0
   */
  const handleClosePopup = () => {
    setOpenPortfolio(0);
  };

  return (
    <section id="portfolio" className="section">
      <h2 className="title">{portfolioData.title}</h2>
      <div className="section-des">{portfolioData.description}</div>

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

export default Customers;
