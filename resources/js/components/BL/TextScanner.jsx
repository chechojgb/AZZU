import { useState, useRef, useEffect } from "react";
import Tesseract from "tesseract.js";

export default function TextScanner({ onClose, onScan  }) {
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
      const activateCamera = async () => {
        try {
          // Listar dispositivos disponibles
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoDevices = devices.filter(device => device.kind === 'videoinput');
          
          // Intentar encontrar la cámara trasera (generalmente es la segunda cámara)
          const rearCamera = videoDevices.length > 1 ? videoDevices[1] : videoDevices[0];
          
          const constraints = {
            video: {
              deviceId: rearCamera ? { exact: rearCamera.deviceId } : undefined,
              facingMode: { ideal: "environment" } // Esto ayuda en algunos dispositivos
            }
          };

          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        } catch (err) {
          console.error("Error al acceder a la cámara:", err);
          // Si falla, intentar con cámara frontal como respaldo
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              videoRef.current.play();
            }
          } catch (fallbackErr) {
            setError("No se pudo acceder a la cámara");
          }
        }
      };

      activateCamera();
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

  const extractData = (rawText) => {
  let text = rawText.replace(/\s+/g, ' ').trim().toUpperCase();

  // Reparar casos de REFBT, REFOJ, REFBR, etc. sin espacio
  text = text.replace(/REF\s*:?\.?\s*(BT|OJ|BR)/g, 'REF: $1');
  text = text.replace(/REF(BT|OJ|BR)/g, 'REF: $1');

  // Normalizar variantes de cantidad
  text = text.replace(/CANTIDAD|CANT\.|CANT-|\sCANT\s+/g, 'CANT:');

  // Buscar línea principal: REF, tipo_producto, código, tamaño, color
  const lineaMatch = text.match(
    /REF[:\s]*([A-Z]{2})[\s\-:]*([0-9]{2,5})[\s\-:]*([0-9]{1,3}M?)[\s\-:/]*([A-Z0-9]{1,4})/
  );

  // Cantidad por empaque
  const cantidadMatch = text.match(/CANT[:\s\-]*([0-9]{1,5})/);

  // Código de barras (último número de 6–8 dígitos)
  const barras = text.match(/\b\d{6,8}\b/g);
  const codigo_barras = barras?.[barras.length - 1] || "";

  return {
    tipo_producto: lineaMatch?.[1] || "",
    codigo_unico: lineaMatch?.[2] || "",
    tamanio: lineaMatch?.[3] || "",
    color_id: lineaMatch?.[4] || "",
    cantidad_por_empaque: cantidadMatch?.[1] || "",
    codigo_barras
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
      onScan(extractedData);
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
