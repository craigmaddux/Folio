import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const RouteLogger = () => {
  const location = useLocation();

  useEffect(() => {
    console.log(`Navigated to route: ${location.pathname}`);
    console.log(`Full URL: ${location.pathname}${location.search}`);
  }, [location]);

  return null; // This component doesn't render anything
};

export default RouteLogger;
