import { useState, useRef, useEffect } from "react";
import Tesseract from "tesseract.js";

export default function TextScanner({ onClose, onSave }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isScanning, setIsScanning] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState(null);

  // Activar cámara
  useEffect(() => {
    if (isScanning) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        })
        .catch(() => {
          setError("No se pudo acceder a la cámara");
        });
    }

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isScanning]);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataURL = canvas.toDataURL("image/png");
      processImage(dataURL);
    }
  };

  const processImage = async (image) => {
    setIsLoading(true);
    setExtractedText("");
    setExtractedData(null);
    try {
      const result = await Tesseract.recognize(image, "eng", {
        logger: (m) => console.log(m),
      });

      const text = result.data.text;
      console.log("[🧼 TEXTO LIMPIO]:", text);
      setExtractedText(text);
      const data = extractData(text);
      console.log("[📦 DATOS EXTRAÍDOS]:", data);
      setExtractedData(data);
    } catch (err) {
      setError("Error al procesar la imagen");
    } finally {
      setIsLoading(false);
    }
  };

  const extractData = (text) => {
  // Limpieza básica
  text = text.replace(/\s+/g, ' ').trim();

  // REF.BT 1287 20M 28
  const lineaRef = text.match(/REF[.:]?\s*([A-Z]{1,4})[\s-]+(\d{2,5})[\s-]+(\d{1,3}M?)\s+([A-Z0-9]{1,4})/i);

  // CANTIDAD
  const cantidadMatch = text.match(/CANT(?:IDAD)?[:.\s]*([0-9]+)/i);

  // Código de barras (último grupo de 6-8 dígitos)
  const barraMatch = text.match(/\b\d{6,8}\b/g);
  const codigo_barras = barraMatch?.[barraMatch.length - 1] || "";

  return {
    tipo_producto: lineaRef?.[1] || "",
    codigo_unico: lineaRef?.[2] || "",
    tamanio: lineaRef?.[3] || "",
    color_id: lineaRef?.[4] || "",
    cantidad_por_empaque: cantidadMatch?.[1] || "",
    codigo_barras,
  };
};

  const handleReintentar = () => {
    setExtractedText("");
    setExtractedData(null);
    setError(null);
    setIsScanning(false);
    setTimeout(() => setIsScanning(true), 100);
  };

  const handleGuardar = () => {
    if (extractedData) {
      onSave(extractedData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full relative shadow-xl">
        <h2 className="text-lg font-bold mb-4">Escanear etiqueta</h2>

        {isScanning && !extractedData && (
          <div className="w-full mb-4">
            <video ref={videoRef} className="w-full rounded" autoPlay muted />
            <canvas ref={canvasRef} className="hidden" />
            <button
              onClick={handleCapture}
              className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Capturar
            </button>
          </div>
        )}

        {isLoading && <p className="text-blue-600">Procesando imagen...</p>}

        {error && <p className="text-red-600">{error}</p>}

        {extractedData && (
          <div className="space-y-2">
            <p><strong>Texto detectado:</strong> {extractedText}</p>
            <p><strong>Tipo de producto:</strong> {extractedData.tipo_producto}</p>
            <p><strong>Código único:</strong> {extractedData.codigo_unico}</p>
            <p><strong>Tamaño:</strong> {extractedData.tamanio}</p>
            <p><strong>Color:</strong> {extractedData.color_id}</p>
            <p><strong>Cantidad por empaque:</strong> {extractedData.cantidad_por_empaque}</p>
            <p><strong>Código de barras:</strong> {extractedData.codigo_barras}</p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={handleReintentar}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Reintentar
              </button>
              <button
                onClick={handleGuardar}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Aceptar y Guardar
              </button>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
        >
          &#10005;
        </button>
      </div>
    </div>
  );
}
