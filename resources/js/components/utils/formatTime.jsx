export default function TiempoFormateado({ tiempo }) {
  if (tiempo === undefined || tiempo === null || tiempo === '') {
    return <span className="">–</span>;
  }

  let horas = 0;
  let minutos = 0;
  let segundos = 0;

  if (typeof tiempo === 'string' && tiempo.includes(':')) {
    const partes = tiempo.split(':');
    horas = parseInt(partes[0], 10);
    minutos = parseInt(partes[1], 10);
    segundos = parseFloat(partes[2]);
  } else if (!isNaN(tiempo)) {
    const totalSegundos = parseFloat(tiempo);
    horas = Math.floor(totalSegundos / 3600);
    minutos = Math.floor((totalSegundos % 3600) / 60);
    segundos = Math.floor(totalSegundos % 60);
  } else {
    return <span className="">–</span>;
  }

  let resultado = '';
  if (horas > 0) {
    resultado = `${horas}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
  } else {
    resultado = `${minutos}:${String(segundos).padStart(2, '0')}`;
  }

  return <span className="">{resultado}</span>;
}
