import { useId, type ReactElement } from 'react';
import { roadSignById, roadSigns } from '../data/roadSigns';

export type RoadSignVisualMode = 'reference' | 'quiz';

const RED = '#c81e1e';
const BLACK = '#101828';
const BLUE = '#1d4ed8';
const WHITE = '#ffffff';
const GREEN = '#15803d';

function WarningFrame() {
  return <polygon points="60,10 112,104 8,104" fill={WHITE} stroke={RED} strokeWidth="8" strokeLinejoin="round" />;
}

function ProhibitionRing() {
  return <circle cx="60" cy="60" r="48" fill={WHITE} stroke={RED} strokeWidth="10" />;
}

function BlueCircle() {
  return <circle cx="60" cy="60" r="50" fill={BLUE} />;
}

function BlueSquare() {
  return <rect x="10" y="10" width="100" height="100" rx="6" fill={BLUE} />;
}

function Plate() {
  return <rect x="14" y="30" width="92" height="60" rx="4" fill={WHITE} stroke={BLACK} strokeWidth="4" />;
}

function CarFront({ cx = 60, cy = 58, scale = 1, fill = BLACK }: { cx?: number; cy?: number; scale?: number; fill?: string }) {
  const t = `translate(${cx} ${cy}) scale(${scale}) translate(-60 -58)`;
  return (
    <g transform={t} fill={fill}>
      <rect x="38" y="40" width="44" height="28" rx="6" />
      <rect x="44" y="46" width="12" height="10" fill={WHITE} />
      <rect x="64" y="46" width="12" height="10" fill={WHITE} />
      <rect x="42" y="66" width="10" height="6" rx="1" />
      <rect x="68" y="66" width="10" height="6" rx="1" />
    </g>
  );
}

function TruckSide({ x = 22, y = 40, trailer = false, axles = 'single' as 'single' | 'drive' | 'bogie' }) {
  return (
    <g fill={BLACK}>
      <rect x={x} y={y + 8} width="16" height="16" rx="2" />
      <rect x={x + 3} y={y + 11} width="8" height="6" fill={WHITE} />
      <rect x={x + 16} y={y} width={trailer ? 28 : 44} height="24" rx="2" />
      <circle cx={x + 10} cy={y + 28} r="4.5" />
      {axles === 'bogie' ? (
        <>
          <circle cx={x + 34} cy={y + 28} r="4.5" />
          <circle cx={x + 46} cy={y + 28} r="4.5" />
          <path d={`M ${x + 30} ${y + 34} H ${x + 50}`} stroke={BLACK} strokeWidth="3" fill="none" />
        </>
      ) : (
        <circle cx={x + (trailer ? 36 : 48)} cy={y + 28} r="4.5" />
      )}
      {axles === 'drive' && <rect x={x + 42} y={y + 32} width="12" height="3" />}
      {trailer && (
        <>
          <line x1={x + 44} y1={y + 18} x2={x + 50} y2={y + 18} stroke={BLACK} strokeWidth="3" />
          <rect x={x + 50} y={y + 2} width="26" height="22" rx="2" />
          <circle cx={x + 60} cy={y + 28} r="4.5" />
          <circle cx={x + 70} cy={y + 28} r="4.5" />
        </>
      )}
    </g>
  );
}

function Worker() {
  return (
    <g fill={BLACK}>
      <circle cx="52" cy="42" r="5" />
      <rect x="46" y="48" width="12" height="18" rx="2" />
      <rect x="44" y="66" width="6" height="14" />
      <rect x="54" y="66" width="6" height="14" />
      <rect x="58" y="52" width="18" height="4" transform="rotate(-35 58 52)" />
      <polygon points="74,46 86,70 78,70 70,52" />
    </g>
  );
}

const SIGN_SYMBOLS: Record<string, () => ReactElement> = {
  a3: () => (
    <g>
      <WarningFrame />
      <path d="M24 46 L96 88 H24 Z" fill={BLACK} />
      <text x="46" y="80" textAnchor="middle" fontSize="11" fontWeight="700" fill={WHITE}>10%</text>
    </g>
  ),
  a4: () => (
    <g>
      <WarningFrame />
      <path d="M24 88 L96 46 V88 Z" fill={BLACK} />
      <text x="74" y="80" textAnchor="middle" fontSize="11" fontWeight="700" fill={WHITE}>10%</text>
    </g>
  ),
  a5: () => (
    <g>
      <WarningFrame />
      <path d="M32 88 L48 48 H72 L88 88" fill="none" stroke={BLACK} strokeWidth="6" />
      <path d="M40 88 L52 52 H68 L80 88" fill="none" stroke={BLACK} strokeWidth="3" />
    </g>
  ),
  a8: () => (
    <g>
      <WarningFrame />
      <path d="M28 78 Q42 42 52 70 Q64 96 74 64 Q84 40 96 78" fill="none" stroke={BLACK} strokeWidth="7" strokeLinecap="round" />
    </g>
  ),
  a10: () => (
    <g>
      <WarningFrame />
      <CarFront cy={50} scale={0.72} />
      <path d="M40 86 Q48 78 56 86 T72 86 T88 86" fill="none" stroke={BLACK} strokeWidth="4" />
      <path d="M36 92 Q44 84 52 92 T68 92 T84 92" fill="none" stroke={BLACK} strokeWidth="4" />
    </g>
  ),
  a20: () => (
    <g>
      <WarningFrame />
      <Worker />
    </g>
  ),
  a24: () => (
    <g>
      <WarningFrame />
      <line x1="44" y1="88" x2="44" y2="44" stroke={BLACK} strokeWidth="5" />
      <polygon points="44,46 86,40 80,58 44,62" fill={BLACK} />
      <polygon points="50,48 78,44 74,56 50,58" fill={WHITE} />
    </g>
  ),
  a25: () => (
    <g>
      <WarningFrame />
      <polygon points="44,44 54,44 54,70 64,70 49,92 34,70 44,70" fill={BLACK} />
      <polygon points="76,92 66,92 66,66 56,66 71,44 86,66 76,66" fill={RED} />
    </g>
  ),
  a35: () => (
    <g>
      <WarningFrame />
      <rect x="30" y="50" width="40" height="22" rx="3" fill={BLACK} />
      <circle cx="40" cy="76" r="6" fill={BLACK} />
      <circle cx="58" cy="76" r="6" fill={BLACK} />
      <rect x="34" y="54" width="10" height="8" fill={WHITE} />
      <rect x="70" y="46" width="6" height="36" fill={BLACK} />
      <rect x="64" y="48" width="28" height="6" fill={RED} />
      <rect x="64" y="58" width="28" height="6" fill={WHITE} stroke={BLACK} strokeWidth="1" />
      <rect x="64" y="68" width="28" height="6" fill={RED} />
    </g>
  ),
  a40: () => (
    <g>
      <WarningFrame />
      <rect x="54" y="42" width="12" height="36" rx="2" fill={BLACK} />
      <circle cx="60" cy="88" r="6" fill={BLACK} />
    </g>
  ),
  b1: () => (
    <g>
      <polygon points="60,108 8,12 112,12" fill={WHITE} stroke={RED} strokeWidth="10" strokeLinejoin="round" />
    </g>
  ),
  b2: () => (
    <g>
      <polygon points="38,10 82,10 110,38 110,82 82,110 38,110 10,82 10,38" fill={RED} stroke={WHITE} strokeWidth="5" />
      <text x="60" y="70" textAnchor="middle" fontSize="22" fontWeight="800" fill={WHITE}>STOP</text>
    </g>
  ),
  c2: () => (
    <g>
      <ProhibitionRing />
    </g>
  ),
  c3: () => (
    <g>
      <ProhibitionRing />
      <CarFront scale={0.9} />
    </g>
  ),
  c6: () => (
    <g>
      <ProhibitionRing />
      <g transform="translate(4 8) scale(0.9)">
        <TruckSide x={18} y={38} trailer />
      </g>
    </g>
  ),
  c16: () => (
    <g>
      <ProhibitionRing />
      <CarFront cy={50} scale={0.7} />
      <polygon points="22,78 36,70 36,86" fill={BLACK} />
      <polygon points="98,78 84,70 84,86" fill={BLACK} />
      <line x1="36" y1="78" x2="84" y2="78" stroke={BLACK} strokeWidth="4" />
      <text x="60" y="96" textAnchor="middle" fontSize="12" fontWeight="800" fill={BLACK}>2,2 m</text>
    </g>
  ),
  c17: () => (
    <g>
      <ProhibitionRing />
      <line x1="28" y1="34" x2="92" y2="34" stroke={BLACK} strokeWidth="6" />
      <polygon points="60,22 68,34 52,34" fill={BLACK} />
      <CarFront cy={62} scale={0.72} />
      <text x="60" y="96" textAnchor="middle" fontSize="12" fontWeight="800" fill={BLACK}>3,8 m</text>
    </g>
  ),
  c18: () => (
    <g>
      <ProhibitionRing />
      <g transform="translate(2 4) scale(0.92)">
        <TruckSide x={22} y={36} trailer />
      </g>
      <polygon points="16,88 28,80 28,96" fill={BLACK} />
      <polygon points="104,88 92,80 92,96" fill={BLACK} />
      <line x1="28" y1="88" x2="92" y2="88" stroke={BLACK} strokeWidth="3" />
      <text x="60" y="104" textAnchor="middle" fontSize="11" fontWeight="800" fill={BLACK}>12 m</text>
    </g>
  ),
  c20: () => (
    <g>
      <ProhibitionRing />
      <TruckSide x={28} y={34} />
      <text x="60" y="92" textAnchor="middle" fontSize="16" fontWeight="800" fill={BLACK}>12 t</text>
    </g>
  ),
  c21: () => (
    <g>
      <ProhibitionRing />
      <g transform="translate(0 2) scale(0.95)">
        <TruckSide x={16} y={32} trailer />
      </g>
      <text x="60" y="94" textAnchor="middle" fontSize="16" fontWeight="800" fill={BLACK}>12 t</text>
    </g>
  ),
  c23: () => (
    <g>
      <ProhibitionRing />
      <TruckSide x={28} y={30} axles="drive" />
      <rect x="66" y="62" width="16" height="5" fill={RED} />
      <text x="60" y="94" textAnchor="middle" fontSize="16" fontWeight="800" fill={BLACK}>8 t</text>
    </g>
  ),
  c24: () => (
    <g>
      <ProhibitionRing />
      <TruckSide x={28} y={30} axles="bogie" />
      <text x="60" y="94" textAnchor="middle" fontSize="16" fontWeight="800" fill={BLACK}>10 t</text>
    </g>
  ),
  c27: () => (
    <g>
      <ProhibitionRing />
      <g transform="translate(-16 0)">
        <CarFront cx={60} cy={58} scale={0.55} fill={RED} />
      </g>
      <g transform="translate(16 8)">
        <CarFront cx={60} cy={58} scale={0.55} />
      </g>
    </g>
  ),
  c31: () => (
    <g>
      <ProhibitionRing />
      <text x="60" y="72" textAnchor="middle" fontSize="36" fontWeight="800" fill={BLACK}>70</text>
    </g>
  ),
  d1: () => (
    <g>
      <BlueCircle />
      <polygon points="32,60 68,36 68,50 96,50 96,70 68,70 68,84" fill={WHITE} />
    </g>
  ),
  e19: () => (
    <g>
      <BlueSquare />
      <text x="60" y="82" textAnchor="middle" fontSize="64" fontWeight="800" fill={WHITE}>P</text>
    </g>
  ),
  e31: () => (
    <g>
      <BlueSquare />
      <CarFront cy={46} scale={0.62} fill={WHITE} />
      <path d="M48 78 C52 68 60 66 64 72 C70 64 80 70 74 80 C68 88 54 88 48 78 Z" fill={GREEN} />
      <text x="60" y="108" textAnchor="middle" fontSize="11" fontWeight="800" fill={WHITE}>Miljözon</text>
    </g>
  ),
  e32: () => (
    <g>
      <BlueSquare />
      <CarFront cy={46} scale={0.62} fill={WHITE} />
      <path d="M48 78 C52 68 60 66 64 72 C70 64 80 70 74 80 C68 88 54 88 48 78 Z" fill={GREEN} />
      <line x1="22" y1="98" x2="98" y2="22" stroke={RED} strokeWidth="12" strokeLinecap="round" />
    </g>
  ),
  t11: () => (
    <g>
      <Plate />
      <polygon points="60,38 70,52 50,52" fill={BLACK} />
      <rect x="56" y="50" width="8" height="20" fill={BLACK} />
      <polygon points="60,82 70,68 50,68" fill={BLACK} />
    </g>
  ),
  t12: () => (
    <g>
      <Plate />
      <rect x="28" y="56" width="40" height="8" fill={BLACK} />
      <polygon points="92,60 68,46 68,74" fill={BLACK} />
    </g>
  ),
};

export const ROAD_SIGN_VISUAL_IDS = Object.keys(SIGN_SYMBOLS);

const missingVisuals = roadSigns.filter((sign) => !SIGN_SYMBOLS[sign.id]).map((sign) => sign.id);
if (missingVisuals.length) {
  throw new Error(`Missing schematic visuals for: ${missingVisuals.join(', ')}`);
}

export function roadSignAccessibleName(signId: string, mode: RoadSignVisualMode): string {
  const sign = roadSignById[signId];
  if (mode === 'quiz') return 'Vägmärke att identifiera';
  if (!sign) return 'Okänt vägmärke';
  return `${sign.officialCode ?? sign.id.toUpperCase()} ${sign.nameSv}`;
}

export function RoadSignVisual({
  signId,
  size = 96,
  mode = 'reference',
}: {
  signId: string;
  size?: number;
  mode?: RoadSignVisualMode;
}) {
  const uid = useId();
  const symbol = SIGN_SYMBOLS[signId];
  const label = roadSignAccessibleName(signId, mode);
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 120 120',
    role: 'img' as const,
    'aria-label': label,
    className: 'sign-visual',
    'data-sign-id': signId,
    'data-visual-mode': mode,
  };

  if (!symbol) {
    return (
      <svg {...common} data-fallback="unknown">
        <rect x="10" y="10" width="100" height="100" fill="#f8fafc" stroke={BLACK} strokeWidth="4" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      {mode === 'reference' && <title>{label}</title>}
      <defs>
        <clipPath id={`${uid}-clip`}>
          <rect x="0" y="0" width="120" height="120" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${uid}-clip)`}>{symbol()}</g>
    </svg>
  );
}
