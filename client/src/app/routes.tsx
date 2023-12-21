import React from 'react';
import Landing from '../pages/landing';
import BlogSingle from '../pages/blog/single-blog';
import Navbar from '../components/Navbar';
import UseCases from '../pages/landing/sections/usecases';

// ------------------

/**
 * Render Navigation bar when rendering a component and isLanding to check
 * if the component to be rendered is the landing page or not.
 *
 * In landing page case: nav links works as scrollable links
 * other case(such as : blog): nav links works as router links
 *
 * @param comonent the component to be rendered
 * @param isLanding check for a component if its the landingpage
 * @returns the given component with the Navbar
 */
 const renderWithNav = (
  component: JSX.Element,
  isLanding: boolean
): JSX.Element => {
  return (
    <>
      <Navbar isLanding={isLanding} />
      {component}
    </>
  );
};

type RoutesType = {
  path: string;
  element: JSX.Element;
  errorElement?: JSX.Element;
};

const routes: RoutesType[] = [
  {
    path: '/',
    element: renderWithNav(<Landing />, true),
  },
  {
    path: '/single-blog',
    element: renderWithNav(<BlogSingle />, false),
  },
  // Add the new dynamic route for industries
  {
    path: '/usecases/:industry',
    element: renderWithNav(<UseCases />, false),
  },
];

export default routes;

// ---------------
