import React, { useEffect } from 'react';
import { WeaponType } from '../engine/combatEngine';

export interface BeamInstance {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  type: WeaponType;
  color: string;
}

interface LaserBeamsProps {
  beams: BeamInstance[];
  onBeamComplete?: (id: string) => void;
}

export const LaserBeams: React.FC<LaserBeamsProps> = ({ beams, onBeamComplete }) => {
  useEffect(() => {
    if (beams.length === 0) return;
    const timers = beams.map((b) =>
      setTimeout(() => {
        onBeamComplete?.(b.id);
      }, 450)
    );
    return () => timers.forEach(clearTimeout);
  }, [beams, onBeamComplete]);

  if (beams.length === 0) return null;

  return (
    <svg className="fixed inset-0 w-full h-full pointer-events-none z-50 overflow-visible">
      <defs>
        <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glow-emerald" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glow-frost" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glow-blossom" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {beams.map((b) => {
        const filterId =
          b.type === 'blossom'
            ? 'url(#glow-blossom)'
            : b.type === 'toxic'
            ? 'url(#glow-emerald)'
            : b.type === 'frost'
            ? 'url(#glow-frost)'
            : 'url(#glow-cyan)';

        const strokeColor =
          b.type === 'blossom'
            ? '#FF3366'
            : b.type === 'toxic'
            ? '#10b981'
            : b.type === 'frost'
            ? '#67e8f9'
            : '#38bdf8';

        return (
          <g key={b.id} className="animate-pulse">
            {/* Main Laser Core Beam */}
            <line
              x1={b.startX}
              y1={b.startY}
              x2={b.endX}
              y2={b.endY}
              stroke={strokeColor}
              strokeWidth="4"
              strokeLinecap="round"
              filter={filterId}
              className="opacity-95"
            />
            {/* High-intensity White Center Beam */}
            <line
              x1={b.startX}
              y1={b.startY}
              x2={b.endX}
              y2={b.endY}
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Impact Flash Circle at Target */}
            <circle
              cx={b.endX}
              cy={b.endY}
              r="14"
              fill={strokeColor}
              filter={filterId}
              className="animate-ping opacity-80"
            />
            <circle
              cx={b.endX}
              cy={b.endY}
              r="6"
              fill="#ffffff"
            />
          </g>
        );
      })}
    </svg>
  );
};
