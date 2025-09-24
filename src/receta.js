import { useState } from 'react';

function RegistrarReceta(props) {
  // Estado para los datos de la receta
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [ingredientes, setIngredientes] = useState('');

  const guardarReceta = async () => {
    // Construir objeto de receta con los valores actuales
    const nuevaReceta = {
      nombre: nombre,
      descripcion: descripcion,
      ingredientes: ingredientes.split(",").map(i => i.trim())
    };
    try {
      const resp = await fetch('http://localhost:3000/api/recetas', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + props.token 
        },
        body: JSON.stringify(nuevaReceta)
      });
      const data = await resp.json();
      if (resp.ok) {
        alert('¡Receta guardada exitosamente!');
      } else {
        alert('No se pudo guardar la receta: ' + (data.error || 'Error desconocido'));
      }
    } catch(error) {
      console.error('Error en guardarReceta:', error);
      alert('Error de conexión al guardar receta.');
    }
  };

  return (
    <div>
      <h2>Registrar Nueva Receta</h2>

      <div>
        <label>Nombre de la receta: </label>
        <input 
          type="text" 
          value={nombre} 
          onChange={e => setNombre(e.target.value)} 
        />
      </div>
      <div>
        <label>Descripción: </label>
        <textarea 
          value={descripcion} 
          onChange={e => setDescripcion(e.target.value)} 
        />
      </div>
      <div>
        <label>Ingredientes (separados por coma): </label>
        <input 
          type="text" 
          value={ingredientes} 
          onChange={e => setIngredientes(e.target.value)} 
        />
      </div>

      <button onClick={guardarReceta}>Guardar Receta</button>
      <button onClick={props.onVerGaleria}>Ver Listado de Recetas</button>
      <button onClick={props.onLogout}>Cerrar Sesión</button>
    </div>
  );
}

export default RegistrarReceta;
