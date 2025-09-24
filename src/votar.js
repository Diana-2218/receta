import { useState, useEffect } from 'react';

function GaleriaRecetas(props) {
  const [recetas, setRecetas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecetas = async () => {
      setCargando(true);
      setError(null);
      try {
        const resp = await fetch('http://localhost:3000/api/recetas', {
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + props.token
          }
        });

        const text = await resp.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (err) {
          console.error('Respuesta no es JSON:', text);
          setError('Respuesta inesperada del servidor');
          setCargando(false);
          return;
        }

        if (!Array.isArray(data)) {
          console.warn('Se esperaba un array de recetas:', data);
          setRecetas([]);
        } else {
          setRecetas(data);
        }
      } catch (err) {
        console.error('Error al cargar recetas:', err);
        setError('Error de conexión al cargar recetas');
      } finally {
        setCargando(false);
      }
    };

    fetchRecetas();
  }, [props.token]);

  const votarReceta = async (id) => {
    try {
      const resp = await fetch(`http://localhost:3000/api/recetas/recetas/vota/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + props.token 
        },
        body: JSON.stringify({ calificacion: 1 })
      });

      const data = await resp.json();

      if (resp.ok) {
        setRecetas(prev => prev.map(r => r._id === id ? { ...r, calificacion: data.calificacion } : r));
      } else {
        alert('No se pudo votar: ' + (data.error || 'Error desconocido'));
      }
    } catch (err) {
      console.error('Error al votar receta:', err);
      alert('Error de conexión al intentar votar.');
    }
  };

  if (cargando) return <p>Cargando recetas...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Galería de Recetas</h2>
      {recetas.length === 0 ? (
        <p>No hay recetas todavía.</p>
      ) : (
        recetas.map(r => (
          <div key={r._id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
            <p><b>{r.nombre}</b></p>
            <p>{r.descripcion}</p>
            <p><b>Ingredientes:</b> {r.ingredientes?.join(', ') || 'No especificados'}</p>
            <p>
              <b>Creador:</b> {r.creador && typeof r.creador === 'object'
                ? `${r.creador.nombre || 'Desconocido'} (${r.creador.correo || '-'})`
                : r.creador || 'Desconocido'}
            </p>
            <p>Calificación: {r.calificacion || 0}</p>
            <button onClick={() => votarReceta(r._id)}>👍 Me gusta</button>
            <button onClick={() => props.onEditarReceta?.(r)}>Editar</button>
            <button onClick={() => props.onEliminarReceta?.(r._id)}>Eliminar</button>
          </div>
        ))
      )}
      <button onClick={props.onVolverDiseño}>Volver a Registrar Receta</button>
      <button onClick={props.onLogout}>Cerrar Sesión</button>
    </div>
  );
}

export default GaleriaRecetas;
