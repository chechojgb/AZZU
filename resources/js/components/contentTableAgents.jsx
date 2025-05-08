import React, { useState } from 'react';

function ContentTableAgents({ data, search, openModal, getStatusClass }) {
    console.log(data);
    
    return (
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 rounded-lg mb-30">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th className="px-6 py-3">Extension</th>
                    <th className="px-6 py-3">Agente</th>
                    <th className="px-6 py-3">IP</th>
                    <th className="px-6 py-3">Estado</th>
                    <th className="px-6 py-3">Tiempo en llamada</th>
                    <th className="px-6 py-3">Administrar</th>
                </tr>
            </thead>
            <tbody>
                {data.map(agent => (
                    <tr key={agent.member.nombre} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{agent.extension}</td>
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{agent.member.nombre}</td>
                        <td className="px-6 py-4">{agent.ip}</td>
                        <td className={`px-6 py-4 ${getStatusClass(agent.member.estado)}`}>{agent.member.estado}</td>
                        <td className="px-6 py-4">{agent.accountcode}</td>
                        <td className="px-6 py-4">
                            <button
                                onClick={() => openModal(agent)}
                                className="block text-gray-700 bg-blue-100 hover:bg-blue-200 focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center"
                            >
                                Administrar
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default ContentTableAgents;