import { useState, useEffect } from 'react';

function RegistrarReceta({ token, onVerGaleria, onLogout, recetaParaEditar }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [ingredientes, setIngredientes] = useState('');

  // Si se va a editar, precargar los campos
  useEffect(() => {
    if (recetaParaEditar) {
      setNombre(recetaParaEditar.nombre || '');
      setDescripcion(recetaParaEditar.descripcion || '');
      setIngredientes((recetaParaEditar.ingredientes || []).join(', '));
    }
  }, [recetaParaEditar]);

  const guardarReceta = async () => {
    const nuevaReceta = {
      nombre: nombre,
      descripcion: descripcion,
      ingredientes: ingredientes.split(",").map(i => i.trim())
    };

    const url = recetaParaEditar
      ? `http://localhost:3000/api/recetas/${recetaParaEditar._id}`
      : 'http://localhost:3000/api/recetas';

    const method = recetaParaEditar ? 'PUT' : 'POST';

    try {
      const resp = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token 
        },
        body: JSON.stringify(nuevaReceta)
      });

      const data = await resp.json();
      if (resp.ok) {
        alert(recetaParaEditar ? '¡Receta actualizada exitosamente!' : '¡Receta guardada exitosamente!');
      } else {
        alert('No se pudo guardar la receta: ' + (data.error || 'Error desconocido'));
      }
    } catch(error) {
      console.error('Error en guardarReceta:', error);
      alert('Error de conexión al guardar receta.');
    }
  };

  return (
    <div className='divreceta'>
      <h2>{recetaParaEditar ? 'Editar Receta' : 'Registrar Nueva Receta'}</h2>

      <div>
        <label>Nombre de la receta: </label>
        <input className='inputreceta'
          type="text" 
          value={nombre} 
          onChange={e => setNombre(e.target.value)} 
        />
      </div>
      <div>
        <label>Descripción: </label>
        <textarea className='inputreceta'
          value={descripcion} 
          onChange={e => setDescripcion(e.target.value)} 
        />
      </div>
      <div>
        <label>Ingredientes (separados por coma): </label>
        <input className='inputreceta'
          type="text" 
          value={ingredientes} 
          onChange={e => setIngredientes(e.target.value)} 
        />
      </div>

      <button onClick={guardarReceta}>
        {recetaParaEditar ? 'Actualizar Receta' : 'Guardar Receta'}
      </button>
      <button onClick={onVerGaleria}>Ver Listado de Recetas</button>
      <button onClick={onLogout}>Cerrar Sesión</button>
    </div>
  );
}

export default RegistrarReceta;
