import React, { useState } from 'react';
import Login from './login';
import Registro from './registro';
import Receta from './receta';   // componente para registrar/modificar recetas
import Votar from './votar';     // componente para ver recetas y votar

function App() {
  const [vistaActual, setVistaActual] = useState('login');
  const [token, setToken] = useState(null);

  // Cuando el login es exitoso:
  const handleLoginSuccess = (tokenRecibido) => {
    setToken(tokenRecibido);
    setVistaActual('diseno'); // ir a la vista de registro de receta
  };

  // Cambiar entre login y registro
  const irARegistro = () => setVistaActual('registro');
  const irALogin = () => setVistaActual('login');

  // Cerrar sesión
  const handleLogout = () => {
    setToken(null);
    setVistaActual('login');
  };

  // Ir a galería (votar)
  const irAGaleria = () => setVistaActual('galeria');

  // Volver de la galería a diseño (registro)
  const volverADiseno = () => setVistaActual('diseno');

  return (
    <div className="App">
      {token ? (
        <>
          {vistaActual === 'diseno' && 
            <Receta token={token} onVerGaleria={irAGaleria} onLogout={handleLogout} />
          }
          {vistaActual === 'galeria' && 
            <Votar token={token} onVolverDiseño={volverADiseno} onLogout={handleLogout} />
          }
        </>
      ) : (
        <>
          {vistaActual === 'login' && 
            <Login onLoginSuccess={handleLoginSuccess} onSwitchToRegister={irARegistro} />
          }
          {vistaActual === 'registro' && 
            <Registro onSwitchToLogin={irALogin} />
          }
        </>
      )}
    </div>
  );
}

export default App;
