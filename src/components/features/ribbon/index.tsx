import { memo, useEffect, useState } from 'react';

const Ribbon = memo(() => {
  const [env, setEnv] = useState('');

  useEffect(() => {
    const hostname = window.location.hostname;

    switch (hostname) {
      case 'localhost':
        setEnv('LOCAL');
        break;
      default:
        if (import.meta.env.VITE_STAGE !== 'prod') {
          setEnv(import.meta.env.VITE_STAGE.toUpperCase());
        }
        break;
    }
  }, []);

  return (
    <>
      {env && (
        <div className="ribbon-container">
          <div className="ribbon-text">{env}</div>
        </div>
      )}
    </>
  );
});

export default Ribbon;
