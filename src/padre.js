import React, { useState } from 'react';
import Login from './login';
import Registro from './registro';
import Receta from './receta';   // formulario de registro/edición
import Votar from './votar';     // galería de recetas

function App() {
  const [vistaActual, setVistaActual] = useState('login');
  const [token, setToken] = useState(null);
  const [recetaParaEditar, setRecetaParaEditar] = useState(null);

  const handleLoginSuccess = (tokenRecibido) => {
    setToken(tokenRecibido);
    setVistaActual('diseno');
  };

  const irARegistro = () => setVistaActual('registro');
  const irALogin = () => setVistaActual('login');
  const handleLogout = () => {
    setToken(null);
    setVistaActual('login');
    setRecetaParaEditar(null);
  };
  const irAGaleria = () => setVistaActual('galeria');
  
  const volverADiseno = () => {
    setRecetaParaEditar(null);  // limpio receta al volver para crear nueva
    setVistaActual('diseno');
  };

  // Cuando editas una receta desde galería
  const manejarEditarReceta = (receta) => {
    setRecetaParaEditar(receta);
    setVistaActual('diseno');
  };

  // Eliminar sin recargar ni actualizar lista
  const manejarEliminarReceta = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta receta?')) return;

    try {
      const resp = await fetch(`http://localhost:3000/api/recetas/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + token,
        },
      });

      if (resp.ok) {
        alert('Receta eliminada correctamente');
        // No actualizamos ni recargamos nada aquí
      } else {
        const data = await resp.json();
        alert('Error al eliminar: ' + (data.error || 'Error desconocido'));
      }
    } catch (error) {
      alert('Error de conexión al eliminar la receta');
    }
  };

  return (
    <div className="App">
      {token ? (
        <>
          {vistaActual === 'diseno' && 
            <Receta 
              token={token} 
              onVerGaleria={irAGaleria} 
              onLogout={handleLogout} 
              recetaParaEditar={recetaParaEditar}  // paso receta para editar
            />
          }
          {vistaActual === 'galeria' && 
            <Votar 
              token={token} 
              onVolverDiseño={volverADiseno} 
              onLogout={handleLogout} 
              onEditarReceta={manejarEditarReceta} // paso handler edición
              onEliminarReceta={manejarEliminarReceta} // paso handler eliminar
            />
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
