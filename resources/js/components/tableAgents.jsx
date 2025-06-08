import React, { useState, useEffect } from 'react';
import { usePage } from "@inertiajs/react";
import { Dropdown, DropdownDivider, DropdownItem } from "flowbite-react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";
import AgentModalWrapper from '@/components/agentsModalWrapper';
import AgentModalContent from '@/components/agentsModalContent';
import ContentTableAgents from '@/components/contentTableAgents';
import { useLoadStatus } from './context/loadContext';
import { themeByProject } from './utils/theme';

import axios from 'axios';

const AgentPanel = () => {
    const { props } = usePage();
    const proyecto = props?.auth?.user?.proyecto || 'AZZU';
    const theme = themeByProject[proyecto];
    const [modalOpen, setModalOpen] = useState(false);
    const [activeExtension, setActiveExtension] = useState(null);
    const [search, setSearch] = useState('');
    const [agents, setAgents] = useState([]);
    const [pollingInterval, setPollingInterval] = useState(null);
    const [stats, setStats] = useState({ total: 0, Busy: 0, 'On Hold': 0, 'In call': 0, 'Ringing': 0 , 'Not in use': 0});
    const [operation, setOperation] = useState(null);

    const fetchStats = (operation) => {
        if (!operation) return;
      
        fetch(`/api/stats/${operation}`)
          .then(res => res.json())
          .then(data => {
            // console.log('Datos crudos de la API:', data);
      
            const cleaned = Object.fromEntries(
              Object.entries(data).filter(([key]) => !['area', 'unknown'].includes(key))
            );
      
            // console.log('Datos filtrados (sin area ni unknown):', cleaned); // 🔍 Log del resultado
      
            setStats(cleaned);
          })
          .catch(() => console.error('Error fetching stats'));
    };

    const fetchAgents = (operation) => {
        if (!operation) return;
        fetch(`/api/agents/${operation}`)
            .then(res => res.json())
            .then(data => {
                console.log('Datos del agente:', data);
                setAgents(data);
                fetchStats(operation); // Llamar fetchStats después de obtener agentes
            })
            .catch(() => console.error('Error fetching agents'));
    };

    const startPolling = (operation) => {
        // Limpia cualquier intervalo existente antes de iniciar uno nuevo
        if (pollingInterval) {
            clearInterval(pollingInterval);
        }

        fetchAgents(operation); // Realiza la primera solicitud inmediatamente
        const intervalId = setInterval(() => {
            fetchAgents(operation);
        }, 8000);

        

        setPollingInterval(intervalId); // Guarda el identificador del intervalo
    };

    useEffect(() => {
        return () => {
            // Limpia el intervalo cuando el componente se desmonte
            if (pollingInterval) {
                clearInterval(pollingInterval);
            }
        };
    }, [pollingInterval]);

    const openModal = (agent) => {
        if (!agent || !agent.extension) {
          console.warn('No se puede abrir el modal: agente inválido');
          return;
        }
      
        console.log('Abriendo modal para:', agent.member?.nombre);
        setActiveExtension(agent.extension);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const getActiveAgent = () => agents.find(a => a.extension === activeExtension) || {};
    

    const customTheme = {
        root: {
            base: 'relative inline-block text-left',
        },
        floating: {
            target: `${theme.bgHard} ${theme.bgHover}/80 focus:ring-none dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-400 dark:border-gray-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center z-50`,
            item: {
                base: 'block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white w-full text-left z-50',
            },
        },
    };
    
    
    const [userOps, setUserOps] = useState([]);
    useEffect(() => {
    axios.get('/user/data')
        .then(res => setUserOps(res.data.operations))
        .catch(err => console.error('Error cargando operaciones', err));
    }, []);
    console.log('Operaciones asignadas:',userOps);
    

    return (
        <div className="rounded-lg mt-4 relative shadow-md sm:rounded-lg px-4 mb-16">
            
            <div className="flex flex-wrap items-center px-4 py-2 text-sm dark:bg-gray-900 break-words max-w-full">
                <a href="/table/agents" className={`${theme.text} `}>Tablas</a>
                <span className="mx-2 text-gray-500">/</span>
                <span>Agentes</span>
                <span className="mx-2 text-gray-500">{operation ? `/` : ''}</span>
                <span>{operation ? ` ${operation}` : ''}</span>
            </div>

            <div className="overflow-hidden shadow-sm pb-60">
                <div className="flex flex-col lg:flex-row flex-wrap items-start lg:items-center justify-between gap-4 px-4 pb-4 pt-2 ">
                    <div className="w-full lg:w-auto mb-2 relative [&_.dropdown-menu]:w-auto [&_.dropdown-menu]:max-w-xs [&_.dropdown-menu]:mx-auto [&_.dropdown-menu]:z-50">
                        <Dropdown
                            label="Selecciona la operación"
                            theme={customTheme}
                            className={`w-full dark:bg-gray-900 `}
                        >
                            {userOps.map((op) => (
                            <DropdownItem
                                key={op}
                                onClick={() => {
                                startPolling(op);
                                setOperation(op);
                                }}
                                className='z-99 '
                            >
                                {op}
                            </DropdownItem>
                            ))}
                        </Dropdown>
                    </div>
                    <div className="flex-1 flex justify-center">
                        <div className="grid grid-cols-3 sm:grid-cols-4 xl:grid-cols-6 gap-4 max-w-full">
                            {Object.entries(stats).map(([key, value]) => (
                            <div
                                key={key}
                                className="text-center  border border-gray-200 dark:border-gray-700 
                                        rounded-xl px-4 py-2 shadow"
                            >
                                <p className="text-xs text-gray-500 dark:text-gray-400">{key}</p>
                                <p
                                className={`text-lg font-semibold cursor-pointer ${getStatusClass(key)}`}
                                onClick={() => key === 'total' ? setSearch('') : setSearch(key)}
                                >
                                {value}
                                </p>
                            </div>
                            ))}
                        </div>
                    </div>

                    <div className="w-full sm:w-auto">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full sm:w-64 block p-2 pl-10 text-sm text-gray-900 border border-gray-200 rounded-xl bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white shadow"
                            placeholder="Buscar agente..."
                        />
                    </div>
                </div>
                <ContentTableAgents
                    data={agents}
                    search={search}
                    openModal={openModal}
                    getStatusClass={getStatusClass}
                />
            </div>

            {/* //ESTO SE ENCARGA DE MOSTRAR EL MODAL */}
            {modalOpen && (
                <AgentModalWrapper closeModal={closeModal}>
                    <AgentModalContent agent={getActiveAgent()} onClose={closeModal} />
                </AgentModalWrapper>
            )}
        </div>
    );
};



const getStatusClass = (status) => {
    switch (status) {
        case 'total':
            return 'text-blue-500 ';
        case 'Busy':
            return 'text-yellow-400 ';
        case 'On Hold':
            return 'text-purple-500';
        case 'In call':
            return 'text-green-600 ';
        case 'Ringing':
            return 'text-red-500';
        case 'Not in use':
            return 'text-blue-400';
        default:
            return '';
    }
};

export default AgentPanel;