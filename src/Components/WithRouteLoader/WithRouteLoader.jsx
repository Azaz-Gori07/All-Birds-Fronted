// ✅ components/WithRouteLoader.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Loading from '../Loading/Loading';

const WithRouteLoader = ({ children }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      <Loading show={loading} />
      {!loading && children}
    </>
  );
};

export default WithRouteLoader;
