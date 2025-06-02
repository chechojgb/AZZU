// import React, { useRef, useState } from 'react';
// import JsSIP from 'jssip';

// function CallListener() {
//   const [isListening, setIsListening] = useState(false);
//   const [extension, setExtension] = useState('7001');
//   const [ua, setUa] = useState(null);
//   const [session, setSession] = useState(null);
//   const audioRef = useRef(null);

//   const SIP_CONFIG = {
//     uri: 'sip:5300@10.57.251.179',
//     password: 'PRU3B42022R3G',
//     ws_servers: 'wss://10.57.251.179:8089/ws',
//     display_name: 'Escucha Web',
//   };

//   const startJsSIP = () => {
//     console.log('[CONFIG] Inicializando JsSIP con:');
//     console.log(JSON.stringify(SIP_CONFIG, null, 2));

//     const socket = new JsSIP.WebSocketInterface(SIP_CONFIG.ws_servers);
//     const configuration = {
//       sockets: [socket],
//       uri: SIP_CONFIG.uri,
//       password: SIP_CONFIG.password,
//       display_name: SIP_CONFIG.display_name,
//       session_timers: false,
//       contact_uri: 'sip:5300@10.57.251.179;transport=wss'
//     };

//     const userAgent = new JsSIP.UA(configuration);

//     userAgent.on('connected', () => {
//       console.log('[STATUS] Conectado al servidor SIP WebSocket');
//     });

//     userAgent.on('disconnected', () => {
//       console.warn('[STATUS] Desconectado del servidor SIP WebSocket');
//     });

//     userAgent.on('registered', () => {
//       console.log('[STATUS] Registro SIP exitoso');
//     });

//     userAgent.on('registrationFailed', (e) => {
//       console.error('[ERROR] Fallo al registrar SIP:', e.cause);
//     });

//     userAgent.on('newRTCSession', function (data) {
//       if (data.originator === 'remote') {
//         const incomingSession = data.session;
//         setSession(incomingSession);
//         console.log('[CALL] Nueva llamada entrante');

//         navigator.mediaDevices.getUserMedia({ audio: true })
//           .then(stream => {
//             console.log('[MIC] Micrófono activo:', stream);
//           })
//           .catch(err => console.error('[ERROR mic]', err));

//         incomingSession.on('peerconnection', function () {
//           const pc = incomingSession.connection;
//           pc.addEventListener('track', function (event) {
//             console.log('[MEDIA] Audio recibido');
//             audioRef.current.srcObject = event.streams[0];
//           });
//         });

//         incomingSession.on('accepted', () => {
//           console.log('[CALL] Aceptada');
//           setIsListening(false);
//         });

//         incomingSession.on('confirmed', () => {
//           console.log('[CALL] Confirmada');
//         });

//         incomingSession.on('ended', () => {
//           console.warn('[CALL] Finalizada');
//           setIsListening(false);
//           setSession(null);
//         });

//         incomingSession.on('failed', (e) => {
//           console.error('[CALL] Fallida:', e.cause);
//           setIsListening(false);
//           setSession(null);
//         });

//         incomingSession.answer({ mediaConstraints: { audio: true, video: false } });
//         console.log('[CALL] Contestando...');
//       }
//     });

//     JsSIP.debug.enable('JsSIP:*');

//     userAgent.start();
//     setUa(userAgent);
//   };

//   const handleListen = () => {
//     if (!isListening && extension) {
//       setIsListening(true);
//       startJsSIP();

//       fetch(`http://localhost:8000/escuchar?ext=${extension}`)
//         .then(res => res.json())
//         .then(data => {
//           console.log('[BACKEND]', data);
//         })
//         .catch(err => {
//           console.error('[ERROR al iniciar escucha]', err);
//         });
//     }
//   };

//   return (
//     <div className="p-6 bg-white rounded-xl shadow-lg max-w-md mx-auto mt-10 text-center">
//       <h2 className="text-lg font-bold mb-4 text-pink-600 flex justify-center items-center gap-2">
//         <span>📞</span> Escucha de llamada
//       </h2>

//       <input
//         type="text"
//         value={extension}
//         onChange={(e) => setExtension(e.target.value)}
//         placeholder="Extensión a escuchar"
//         className="border px-4 py-2 rounded w-full mb-4"
//         disabled={isListening}
//       />

//       <button
//         onClick={handleListen}
//         disabled={isListening}
//         className={`px-6 py-3 rounded-md text-white transition ${
//           isListening ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-700'
//         }`}
//       >
//         {isListening
//           ? 'Esperando llamada...'
//           : session
//           ? 'Escuchando llamada'
//           : `Escuchar ${extension}`}
//       </button>

//       <audio ref={audioRef} autoPlay controls className="mt-6 w-full" />
//     </div>
//   );
// }

// export default CallListener;


import React, { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import DataAgent from '@/components/dataAgent';
import ListenRecords from '@/components/listenRecords';
import AdminActions from '@/components/adminActions';
// Removed incompatible import

const breadcrumbs = [
  {
    title: 'Administrar Agente',
    href: '/showTableAgents',
  },
];

const AgentControlPanel = ({ agent }) => {
  const [data, setData] = useState(null);

  const fetchAgent = () => {
    fetch(`/api/agent/${agent}`)
      .then((res) => res.json())
      .then((resData) => {
        // console.log('Datos del agente:', resData); // Using console.log directly
        setData(resData);
      })
      .catch((err) => console.error('Error al obtener datos del agente', err));
  };
    
  useEffect(() => {
    fetchAgent();
    const interval = setInterval(fetchAgent, 3000);
    return () => clearInterval(interval);
  }, [agent]);


  if (!data) return <div className="text-center text-sm text-gray-500">Cargando agente...</div>;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="showTableAgents" />
      <div className="min-h-screen text-gray-900 dark:text-white p-8 space-y-10">
        <DataAgent data={data} />
        <ListenRecords extension={data.extension}/>
        <AdminActions data={data} />
      </div>
    </AppLayout>
  );
};

export default AgentControlPanel;


const ActionCard = ({ icon, label, color }) => (
    <button
      className={`flex flex-col items-center justify-center gap-2 py-6 rounded-xl shadow-md bg-${color}-600 hover:bg-${color}-700 text-white transition-all`}
    >
      <div className="text-3xl">{icon}</div>
      <p className="text-sm font-medium">{label}</p>
    </button>
  );
