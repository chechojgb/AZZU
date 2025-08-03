export const themeByProject = {
  AZZU: {
    text: 'text-purple-light-20',
    textSafe: 'text-purple-400',
    bg: 'bg-purple-light-20',
    bgSafe: 'bg-purple-100',
    bgHard: 'bg-purple-400',
    bgHover: 'hover-bg-purple-light-20',
    border: 'border-purple-light-20',
  },
  CO: {
    text: 'text-green-600',
    textSafe: 'text-green-400',
    bg: 'bg-green-200',
    bgSafe: 'bg-green-100',
    bgHard: 'bg-green-400',
    bgHover: 'hover:bg-green-300',
    border: 'border-green-500',
  },
  AR: {
    text: 'text-red-600',
    textSafe: 'text-red-400',
    bg: 'bg-red-200',
    bgSafe: 'bg-red-100',
    bgHard: 'bg-red-400',
    bgHover: 'hover:bg-red-300',
    border: 'border-red-500',
  },
  "Button Lovers": {
    text: 'text-blue-600',
    textSafe: 'text-blue-400',
    bg: 'bg-blue-200',
    bgSafe: 'bg-blue-100',
    bgHard: 'bg-blue-400',
    bgHover: 'hover:bg-blue-300',
    border: 'border-blue-500',
  },
};


export function getChartColors(proyecto) {
  const map = {
    AZZU: {
      fill: 'rgba(147, 51, 234, 0.2)',  // morado
      border: 'rgba(147, 51, 234, 1)',
    },
    CO: {
      fill: 'rgba(34, 197, 94, 0.2)',   // verde
      border: 'rgba(34, 197, 94, 1)',
    },
    AR: {
      fill: 'rgba(220, 38, 38, 0.2)',   // rojo
      border: 'rgba(220, 38, 38, 1)',
    },
  };

  return map[proyecto] || map['AZZU']; // fallback a AZZU
}