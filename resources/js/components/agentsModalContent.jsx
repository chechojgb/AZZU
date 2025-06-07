import { Link } from "@inertiajs/react";
import {getStatusClass, getStatusBorderClass, getStatusBgClass} from '@/utils/statusStyles'

const AgentModalContent = ({ agent, onClose }) => (
    <>
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-12 h-12 rounded-full ${getStatusBgClass(agent.member?.estado)} flex items-center justify-center text-white text-lg font-semibold`}>👤</div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{agent.member.nombre}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400"></p>
        </div>
        <div className="ml-auto text-right">
          <p className={`${getStatusClass(agent.member?.estado)}  text-sm font-semibold`}>{agent.member?.estado}</p>
          <p className="text-xs text-gray-500 dark:text-gray-300">{agent.accountcode}</p>
        </div>
      </div>
  
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h4 className="text-sm font-semibold mb-2 text-gray-800 dark:text-gray-200">Acciones que puedes realizar</h4>
        <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
          {agent.member2?.pausa ? (
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full"></span>Despausar</span>
            ) : (
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-yellow-500 rounded-full"></span>Pausar</span>
          )}
          {/* <span className="opacity-70 cursor-pointer">Mover a cola</span> */}
        </div>
        {agent.inCall === true && (
        <div className="flex gap-3 mb-4 pt-4">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium">🎧 Escuchar llam.</button>
          <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md text-sm font-medium">📞 Finalizar llam.</button>
        </div>
        )}
      </div>
  
      <div  className="pt-4 text-sm text-indigo-600 dark:text-indigo-400 font-semibold cursor-pointer hover:underline">
        <Link href={route('editAgent', agent.extension)}>Administrar</Link>
      </div>
    </>
  );
  
  export default AgentModalContent;
  