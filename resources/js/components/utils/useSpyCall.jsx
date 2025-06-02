// utils/useSpyCall.js
import { useEffect, useRef, useState } from 'react';
import JsSIP from 'jssip';
// import { log } from 'node:console';
import debug from 'debug';
debug.disable();

const SIP_URI = 'sip:5300@10.57.251.179';
const SIP_PASSWORD = 'PRU3B42022R3G';
const WS_URL = 'wss://10.57.251.179:8089/ws';

export function useSpyCall(extension) {
  const uaRef = useRef(null);
  const sessionRef = useRef(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [mode, setMode] = useState('normal'); // normal | whisper
  

  useEffect(() => {
    const socket = new JsSIP.WebSocketInterface(WS_URL);

    const ua = new JsSIP.UA({
      sockets: [socket],
      uri: SIP_URI,
      password: SIP_PASSWORD,
      session_timers: false,
      register: true,
    });

    uaRef.current = ua;

    ua.on('connected', () => {
      console.log('✅ WebSocket conectado');
    });

    ua.on('disconnected', () => {
      console.warn('❌ WebSocket desconectado');
    });

    ua.on('registered', () => {
      console.log('✅ Registro SIP exitoso');
      setIsRegistered(true);
    });

    ua.on('unregistered', () => {
      console.warn('🔌 SIP no registrado');
      setIsRegistered(false);
    });

    ua.on('registrationFailed', (e) => {
      console.error('❌ Registro SIP fallido:', e.cause);
    });

    ua.start();

    return () => {
      if (ua.isRegistered()) ua.unregister();
      ua.stop();
    };
  }, []);

  const startCall = (customMode = 'normal') => {
    if (!uaRef.current || !extension) return;

    const targetExt =
      customMode === 'whisper'
        ? `12453143${extension}`
        : `1245331${extension}`;

    console.log(`📞 Iniciando llamada a extensión ${targetExt} (modo: ${customMode})`);

    const session = uaRef.current.call(`sip:${targetExt}@10.57.251.179`, {
      mediaConstraints: { audio: true, video: false },
      rtcOfferConstraints: {
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 0,
      },
    });

    sessionRef.current = session;
    setIsCalling(true);
    setMode(customMode);

    session.on('peerconnection', (e) => {
      const pc = e.peerconnection;
      console.log('📡 peerConnection creada');

      pc.oniceconnectionstatechange = () => {
        console.log('🌐 ICE connection state:', pc.iceConnectionState);
      };

      pc.onconnectionstatechange = () => {
        console.log('🔗 Peer connection state:', pc.connectionState);
      };

      pc.onsignalingstatechange = () => {
        console.log('📶 Signaling state:', pc.signalingState);
      };

      pc.onicegatheringstatechange = () => {
        console.log('📥 ICE gathering state:', pc.iceGatheringState);
      };

      pc.ontrack = (event) => {
        console.log('🎧 Recibiendo track de audio:', event.track.kind);
      };
    });

    session.on('connecting', () => {
      console.log('🔄 Conectando...');
    });

    session.on('sending', (data) => {
      console.log('📤 Enviando SDP:', data);
    });

    session.on('accepted', () => {
      console.log('✅ Llamada aceptada por Asterisk');
    });

    session.on('confirmed', () => {
      console.log('📞 Llamada confirmada (establecida)');
    });

    session.on('ended', () => {
      console.log('📴 Llamada espía finalizada');
      setIsCalling(false);
      sessionRef.current = null;
    });

    session.on('failed', (e) => {
      console.warn('⚠️ Llamada espía fallida:', e.cause || 'desconocido');
      setIsCalling(false);
      sessionRef.current = null;
    });
  };

  const stopCall = () => {
    if (sessionRef.current) {
      console.log('⛔ Terminando llamada espía');
      sessionRef.current.terminate();
      setIsCalling(false);
    }
  };

  const toggleMode = () => {
    const newMode = mode === 'normal' ? 'whisper' : 'normal';
    console.log(`🔁 Cambiando modo de escucha a: ${newMode}`);
    stopCall();
    setTimeout(() => startCall(newMode), 1000);
  };

  return {
    isRegistered,
    isCalling,
    mode,
    startCall,
    stopCall,
    toggleMode,
  };
}
