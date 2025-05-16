export default async function TransferCall({ canal, destino }) {
  const payload = {
    canal,
    destino,
  };

  console.log('➡️ Enviando a la API:', payload);

  try {
    const response = await fetch('/api/transfer-call', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, message: data.message };
    } else {
      return { success: false, message: data.error || 'Error desconocido' };
    }
  } catch (error) {
    console.error('Error al transferir:', error);
    return { success: false, message: 'Error de red o servidor' };
  }
}
