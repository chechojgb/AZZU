const FechaSelector = ({ fecha, setFecha, nuevo }) => {
  return (
    <input
      type="date"
      name="fecha"
      value={fecha}
      onChange={(e) => setFecha(e.target.value)}
      className="border rounded-lg p-2 w-full"
    />
  );
};

export default FechaSelector;