import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Optional: you can use 'smooth' if you want a smooth scroll, but 'instant' is usually better for page transitions
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
