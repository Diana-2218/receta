import { useState } from 'react';

function Contador() {
  const [cuenta, setCuenta] = useState(0);  // estado inicial = 0
  const [espar, setEsPar] = useState('Par')

  const incrementar = () => {
    setCuenta(cuenta + 1);
    if (cuenta % 2 == 0)
    {
        setEsPar('Impar')

    }
    else 
    {
        setEsPar('Par')
    }
    
  };

  return (
    <div>
      <p>Has hecho clic {cuenta} veces.</p>
      <button onClick={incrementar}>Incrementar</button>
      <h3>{espar}</h3>
    </div>
  );
}

export default Contador;
