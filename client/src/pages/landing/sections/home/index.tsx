import { Link as ScrollLink } from 'react-scroll';
import { useEffect } from 'react';

// Images
import scrollIcon from '../../../../assets/images/home/scroll-icon.svg';

// Styles
import './style.css';

// Data
import homeData from '../../../../data/home.json';

// ---------------
function Home() {
  useEffect(() => {
    if (localStorage.getItem('scrollToUseCases')) {
      // Scroll to the 'usecases' section after the page has loaded
      setTimeout(() => {
        const useCasesSection = document.getElementById('usecases');
        if (useCasesSection) {
          useCasesSection.scrollIntoView({ behavior: 'smooth' });
        }
        // Clear the flag
        localStorage.removeItem('scrollToUseCases');
      }, 50); // Adjust this delay as needed
    }
  }, []);
  return (
    <section id="home" className="h-screen flex flex-col justify-center items-center px-4 md:items-end md:pr-20">
      <div className="text-center md:text-right">
        {/* Responsive headers */}
        <h1 className="text-4xl md:text-6xl lg:text-6xl font-bold leading-none mt-4 md:mt-6">
            {homeData.header1}
            <br />
            {homeData.header2}
          </h1>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-normal leading-none bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-yellow-500">
            {homeData.punchline}
          </h2>
          {/* Hamburger icon for mobile */}
        
        <ScrollLink to="services" smooth className="self-center mt-24 cursor-pointer animate-bounce flex flex-col items-center">
          <span className="text-med mb-2">Try it yourself</span>
          <img src={scrollIcon} alt="Scroll down" className="w-16 h-16" />
        </ScrollLink>
      </div>
    </section>
  );
}

export default Home;
