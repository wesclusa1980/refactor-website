import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import PortfolioItem1 from './items/Usecase_Retail';
import PortfolioItem2 from './items/PortfolioItem2';
import PortfolioItem3 from './items/UseCase_Hospitality';
import portfolioData from '../../../../data/usecases.json';

// Images
import portfolio1 from '../../../../assets/images/portfolio/portfolio3.jpg';
import portfolio2 from '../../../../assets/images/portfolio/portfolio3.jpg';
import portfolio3 from '../../../../assets/images/portfolio/portfolio3.jpg';
import portfolio4 from '../../../../assets/images/portfolio/portfolio3.jpg';
import portfolio5 from '../../../../assets/images/portfolio/portfolio3.jpg';

function UseCases() {
  const { industry } = useParams<{ industry: string }>();
  const [portfolioItem, setPortfolioItem] = useState<number>(0);
  const [openPortfolio, setOpenPortfolio] = useState<number>(0);

  const handleOpenItem = (num: number) => {
    setPortfolioItem(num);
  };

  const handleCloseItem = () => {
    setPortfolioItem(0);
  };

  const handleOpenPopup = (num: number) => {
    setOpenPortfolio(num);
  };
  const handleClosePopup = () => {
    setOpenPortfolio(0);
  }
  // Image mapping based on the item number
  const images = [portfolio1, portfolio2, portfolio3, portfolio4, portfolio5];

  const renderPortfolioItems = () => {
    // Create an array to hold all items from all industries
    let allItems = [];
    for (const industryKey in portfolioData.industries) {
      allItems = allItems.concat(portfolioData.industries[industryKey]);
    }
  
    // Map over all items and create the JSX elements for them
    return allItems.map((item, i) => (
      <div
        key={'port-item-' + i}
        className={`cursor-pointer ${item.gridSize}`}
        onClick={() =>
          item.action.type === 'item' ? handleOpenItem(item.action.number) : handleOpenPopup(item.action.number)
        }
      >
        <img src={images[item.action.number - 1]} alt="portfolio" />
        <div>
          <p>{item.description.text}</p>
          <p>{item.description.caption}</p>
        </div>
      </div>
    ));
  };
  return (
    <section id="usecases" className="section">
      <h2 className="title">Use Cases</h2>
      <div className="section-des">{portfolioData.description}</div>

      <div id="portfolio-wrapper" className="grid grid-cols-4 gap-4">
        {renderPortfolioItems()}
      </div>

      {/* Conditional rendering for portfolio items or popups */}
      {portfolioItem !== 0 && (
        <div>
          {portfolioItem === 1 && <PortfolioItem1 />}
          {portfolioItem === 2 && <PortfolioItem2 />}
          {portfolioItem === 3 && <PortfolioItem3 />}
          <button onClick={handleCloseItem}>Close</button>
        </div>
      )}

      <Popup open={openPortfolio !== 0} closeOnDocumentClick onClose={handleClosePopup} modal>
        {/* Conditional content based on openPortfolio */}
        {openPortfolio === 1 && (
          // Popup content for item 1
          <PortfolioItem1 />
        )}
        {openPortfolio === 2 && (
          // Popup content for item 2
          <PortfolioItem2 />
        )}
        {openPortfolio === 3 && (
          // Popup content for item 3
          <PortfolioItem3 />
        )}
      </Popup>
    </section>
  );
}

export default UseCases;
