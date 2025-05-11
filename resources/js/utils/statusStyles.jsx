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
            return 'text-gray-300';
    }
  };
  const getStatusBorderClass = (status) => {
    switch (status) {
      case 'total':
        return 'border-blue-500';
      case 'Busy':
        return 'border-yellow-400';
      case 'On Hold':
        return 'border-purple-500';
      case 'In call':
        return 'border-green-600';
      case 'Ringing':
        return 'border-red-500';
      case 'Not in use':
        return 'border-blue-400';
      default:
        return 'border-gray-300'; // por si no hay estado
    }
  };
  
  
  const getStatusBgClass = (status) => {
    switch (status) {
      case 'total':
        return 'bg-blue-500';
      case 'Busy':
        return 'bg-yellow-400';
      case 'On Hold':
        return 'bg-purple-500';
      case 'In call':
        return 'bg-green-600';
      case 'Ringing':
        return 'bg-red-500';
      case 'Not in use':
        return 'bg-blue-400';
      default:
        return 'bg-gray-300'; // por si no hay estado
    }
  };
  
export { getStatusClass, getStatusBorderClass, getStatusBgClass };
