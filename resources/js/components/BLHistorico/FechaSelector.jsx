// resources/js/components/BLHistorico/FechaSelector.jsx
const FechaSelector = ({ nuevo, handleChange }) => {
  return (
    <input
      type="date"
      name="fecha"
      value={nuevo.fecha}
      onChange={handleChange}
      className="border rounded-lg p-2 w-full"
    />
  );
};

export default FechaSelector;