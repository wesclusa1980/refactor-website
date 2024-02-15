// Sections
import Contact from './sections/contact';
import HomeSection from './sections/home';
import Portfolio from './sections/customers';
import Industries from './sections/demo';
import UseCases from './sections/usecases';

function Home() {
  return (
    <>
      <HomeSection />
      <Industries />
       <UseCases /> 
      <Portfolio />
      <Contact />
    </>
  );
}

export default Home;
