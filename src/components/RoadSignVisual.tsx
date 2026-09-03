import { roadSignById } from '../data/roadSigns';

function Ring({ stroke = '#c81e1e' }: { stroke?: string }) {
  return <circle cx="60" cy="60" r="46" fill="white" stroke={stroke} strokeWidth="10" />;
}

export function RoadSignVisual({ signId, size = 96 }: { signId: string; size?: number }) {
  const sign = roadSignById[signId];
  const label = sign ? `${sign.officialCode ?? sign.id.toUpperCase()} ${sign.nameSv}` : signId;
  const common = { width: size, height: size, viewBox: '0 0 120 120', role: 'img' as const, 'aria-label': label };

  if (!sign) return <svg {...common}><rect x="10" y="10" width="100" height="100" fill="#f8fafc" stroke="#344054" strokeWidth="4" /><text x="60" y="66" textAnchor="middle" fontSize="14">{signId}</text></svg>;

  if (sign.category === 'warning') {
    return (
      <svg {...common}>
        <polygon points="60,10 110,100 10,100" fill="white" stroke="#c81e1e" strokeWidth="8" />
        <text x="60" y="78" textAnchor="middle" fontSize="20" fontWeight="700" fill="#101828">{sign.officialCode}</text>
      </svg>
    );
  }

  if (sign.category === 'priority') {
    return (
      <svg {...common}>
        <polygon points="60,8 112,60 60,112 8,60" fill="#fbbf24" stroke="#101828" strokeWidth="5" />
        <text x="60" y="67" textAnchor="middle" fontSize="20" fontWeight="700" fill="#101828">{sign.officialCode}</text>
      </svg>
    );
  }

  if (sign.category === 'mandatory') {
    return (
      <svg {...common}>
        <circle cx="60" cy="60" r="50" fill="#1d4ed8" />
        <text x="60" y="67" textAnchor="middle" fontSize="22" fontWeight="700" fill="white">{sign.officialCode}</text>
      </svg>
    );
  }

  if (sign.category === 'information' || sign.category === 'instruction') {
    return (
      <svg {...common}>
        <rect x="12" y="12" width="96" height="96" rx="10" fill="#2563eb" stroke="#101828" strokeWidth="3" />
        <text x="60" y="67" textAnchor="middle" fontSize="22" fontWeight="700" fill="white">{sign.officialCode}</text>
      </svg>
    );
  }

  if (sign.category === 'supplementary') {
    return (
      <svg {...common}>
        <rect x="8" y="28" width="104" height="64" rx="8" fill="white" stroke="#101828" strokeWidth="4" />
        <text x="60" y="68" textAnchor="middle" fontSize="22" fontWeight="700" fill="#101828">{sign.officialCode}</text>
      </svg>
    );
  }

  return (
    <svg {...common}>
      <Ring />
      <text x="60" y="67" textAnchor="middle" fontSize="22" fontWeight="700" fill="#101828">{sign.officialCode}</text>
    </svg>
  );
}
