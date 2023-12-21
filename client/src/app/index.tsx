import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// fonts
import '@fontsource/poppins/100.css';
import '@fontsource/poppins/200.css';
import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import '@fontsource/poppins/800.css';
import '@fontsource/poppins/900.css';

// Styles
import 'bootstrap/dist/css/bootstrap-grid.css';
import '../assets/css/setup.css';
import '../assets/css/style.css';
//import '../assets/css/responsive.css';

// routes
import routes from './routes';

// UI Components
import Layout from '../components/Layout';

// -------------
import ReactGA from 'react-ga';
const TRACKING_ID = "G-1NYVFPZ12E"; 
ReactGA.initialize(TRACKING_ID);
/**
 * Making base name for the website (needed in deployment)
 */
const router = createBrowserRouter(routes, {
  basename: '/',
});

function App() {
  ReactGA.pageview(window.location.pathname + window.location.search);
  return (
    <div className="App">
      <Layout>
        <RouterProvider router={router} />
      </Layout>
    </div>
  );
}

export default App;
