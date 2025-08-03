import { useState } from 'react';
import { TextInput, Select, Button, Label } from 'flowbite-react';
import { HiOutlineCamera, HiCheck } from 'react-icons/hi';
import BarcodeScanner from './BarcodeScanner';
import TextScanner from './TextScanner';

export default function AddDbColores({ onClose, onSave }) {
  const [showScanner, setShowScanner] = useState(false);
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
  });


  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="space-y-6 max-w-xl">
      <h2 className="text-lg font-semibold">Agregar Nuevo Color</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sección de Escaneo */}
  

        {/* Campos del Formulario */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <Label htmlFor="codigo" value="codigo del producto" />
            <TextInput
              id="codigo"
              required
              placeholder="Codigo del color"
              value={formData.codigo}
              onChange={(e) =>
                setFormData({ ...formData, codigo: e.target.value.toUpperCase() })
              }
            />
          </div>
          <div>
            <Label htmlFor="nombre" value="nombre del color" />
            <TextInput
              id="nombre"
              required
              placeholder="Nombre del color"
              value={formData.codigo_unico}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
            />
          </div>
        </div>


        {/* Botones */}
        <div className="flex justify-between pt-4 border-t mt-6">
          <Button color="gray" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            <HiCheck className="mr-2" />
            Guardar Producto
          </Button>
        </div>
      </form>
    </div>
  );
}
