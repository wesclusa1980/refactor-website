// Sections
import Contact from './sections/contact';
import HomeSection from './sections/home';
import Portfolio from './sections/customers';
import Industries from './sections/demo';
import UseCases from './sections/usecases';

function Home() {
  // Function to check for the existence of the pandaCookie
  const hasPandaCookie = () => {
    return document.cookie.split(';').some((item) => item.trim().startsWith('pandaCookie='));
  };

  return (
    <>
      <HomeSection />
      <Industries />
      {hasPandaCookie() && <UseCases />} {/* Render UseCases only if pandaCookie exists */}
      <Portfolio />
      <Contact />
    </>
  );
}

export default Home;
