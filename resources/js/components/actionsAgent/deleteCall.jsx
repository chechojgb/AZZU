// resources/js/components/actionsAgent/deleteCall.js
export default async function hangupChannel(channel) {
  try {
    const response = await fetch('/api/hangup-channel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ channel }),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, message: data.message };
    } else {
      return { success: false, message: data.error || 'Error desconocido' };
    }
  } catch (error) {
    console.error('Error colgando canal:', error);
    return { success: false, message: 'Error de red o servidor' };
  }
}
