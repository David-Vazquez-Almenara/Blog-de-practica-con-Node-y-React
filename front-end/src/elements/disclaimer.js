import React, { useState, useEffect } from 'react';
import '../css/disclaimer.css';

const Disclaimer = () => {
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [buttonEnabled, setButtonEnabled] = useState(false);

  useEffect(() => {
    const firstTimeNavigating = localStorage.getItem('FirstTimeNavigating');
    if (!firstTimeNavigating || firstTimeNavigating === 'false') {
      setShowDisclaimer(true);
      setTimeout(() => {
        setButtonEnabled(true);
      }, 4000); // Cambiado a 4 segundos
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('FirstTimeNavigating', 'true');
    setShowDisclaimer(false);
  };

  return (
    <>
      {showDisclaimer && (
        <div className="disclaimer-overlay">
          <div className="disclaimer-content">
            <h2>⚠ DISCLAIMER ⚠</h2>
            <p>
              Todo lo que se ve en la web no se usa realmente y no tiene un uso comercial real.
              <br/><br/>
              Todo lo que se muestra se usa de manera recreativa y educativa sin fines lucrativos.
            </p>
            <div className="button-container">
              {/* Aquí agregamos la barra de progreso como fondo del botón */}
              <div className="button-progress"></div>
              <button onClick={handleClose} disabled={!buttonEnabled}>Entendido</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Disclaimer;
