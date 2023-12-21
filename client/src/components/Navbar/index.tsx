import React, { useState } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink } from 'react-router-dom';

import './style.css';
import navData from '../../data/navbar.json';
import hamburger from '../../assets/images/hamburger.svg';

function Navbar({ isLanding }) {
  const [navActive, setNavActive] = useState(false);
  const [sectionNum, setSectionNum] = useState(1);

  const handleLinkClick = () => {
    setNavActive(false);
  };

  const handleActive = (numToActivate) => {
    setSectionNum(numToActivate);
  };

  const handleMenuBtnClick = () => {
    setNavActive(!navActive);
  };

  return (
    <div>
    <div
      id="nav-btn"
      className={`nav-btn ${navActive ? 'active' : ''} md:hidden`}
      role="button"
      onClick={handleMenuBtnClick}
    >
      <span className="nav-btn-cover">
      <img src={hamburger} alt="Menu" className="w-6 h-6" />
      </span>
    </div>
      <div className={`s-nav ${navActive ? 'active' : ''}`}>
        <div className="nav-count">
          <div className="current-num">
            <span>{`0${sectionNum}`}</span>
          </div>
          <div className="pagination-sep">/</div>
          <div className="total-pages-num">
            <span>{`0${navData.navLinks.length}`}</span>
          </div>
        </div>
        <div className="mb-8">
          <RouterLink
            to="/"
            className="site-title font-bold text-lg uppercase tracking-widest relative underline decoration-2 decoration-current underline-offset-4 hover:no-underline"
            onClick={handleLinkClick}
          >
            {navData.homeLink.text}
          </RouterLink>
          </div>
        <nav>
          <ul className="nav-list">
            {navData.navLinks.map((link, i) => (
              <li key={i}>
                {isLanding ? (
                  <ScrollLink
                    activeClass="current"
                    to={link.to}
                    spy={true}
                    smooth={true}
                    offset={-70}
                    duration={500}
                    onSetActive={() => handleActive(i + 1)}
                    onClick={handleLinkClick}
                  >
                    {link.text}
                  </ScrollLink>
                ) : (
                  <RouterLink to={link.to} onClick={handleLinkClick}>
                    {link.text}
                  </RouterLink>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <ul className="nav-soc">
          {navData.footLinks.map((link, i) => (
            <li key={`foot-link-${i}`}>
              <a href={link.to} target="_blank" rel="noopener noreferrer">
                {link.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
