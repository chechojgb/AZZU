// resources/js/components/BLHistorico/hooks/useMarcaciones.js
import { useState } from 'react';

export const useMarcaciones = () => {
  const [marcados, setMarcados] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [precios, setPrecios] = useState({});
  const [nuevo, setNuevo] = useState({
    cliente: "",
    clienteId: null,
    pedido: "",
    pedidoId: null,
    trabajador: "",
    trabajadorId: null,
    fecha: "",
    proyecto: ""
  });
  const [sugerencias, setSugerencias] = useState([]);
  const [pedidosDisponibles, setPedidosDisponibles] = useState([]);
  const [itemsDisponibles, setItemsDisponibles] = useState([]);

  return {
    marcados, setMarcados,
    seleccionados, setSeleccionados,
    precios, setPrecios,
    nuevo, setNuevo,
    sugerencias, setSugerencias,
    pedidosDisponibles, setPedidosDisponibles,
    itemsDisponibles, setItemsDisponibles
  };
};