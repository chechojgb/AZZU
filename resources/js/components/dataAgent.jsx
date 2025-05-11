import React, { useState, useEffect } from "react";
import {getStatusClass, getStatusBorderClass, getStatusBgClass} from '@/utils/statusStyles'

function DataAgent({ data }) {
  return (
    <div className={ `flex items-center justify-between dark:bg-[#011111] border-l-4 ${getStatusBorderClass(data.member?.estado)} px-6 py-4 rounded-lg shadow-sm` }>
      <div className="flex items-center gap-4 relative">
        <div className="relative">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-white text-xl">👤</div>
          <span className={ `absolute bottom-0 right-0 w-3 h-3 ${getStatusBgClass(data.member?.estado)} border-2 border-white rounded-full` }></span>
        </div>
        <div>
          <h4 className="text-base font-semibold">{data.member?.nombre || 'Agente no conectado'} - {data.extension || 'Extension no conectada'}</h4>
          <p className="text-sm">{data.ip || 'IP no encontrada'}</p>
        </div>
      </div>
      <div className="text-right">
        <span className={ ` font-medium text-sm ${getStatusClass(data.member?.estado)} `}>{data.member?.estado || 'Sin conexion'}</span>
        <div className="text-xs text-gray-400">{data.duration || 'Sin tiempo de gestion'}</div>
      </div>
    </div>
  );
}




export default DataAgent;
