import React, { useState } from 'react';
import type { LockType } from '../../types';
import { KeyRound, Grid, ShieldAlert, RotateCcw } from 'lucide-react';

interface PatternLockSelectorProps {
  lockType: LockType;
  lockCode: string;
  onChange: (type: LockType, code: string) => void;
}

export const PatternLockSelector: React.FC<PatternLockSelectorProps> = ({
  lockType,
  lockCode,
  onChange,
}) => {
  const [patternDots, setPatternDots] = useState<number[]>(() => {
    if (lockType === 'pattern' && lockCode && lockCode !== 'NO_LOCK') {
      return lockCode.split('-').map(Number).filter(n => !isNaN(n));
    }
    return [1, 4, 7, 8];
  });

  const dotCoords: Record<number, { x: number; y: number }> = {
    1: { x: 35, y: 35 },
    2: { x: 95, y: 35 },
    3: { x: 155, y: 35 },
    4: { x: 35, y: 95 },
    5: { x: 95, y: 95 },
    6: { x: 155, y: 95 },
    7: { x: 35, y: 155 },
    8: { x: 95, y: 155 },
    9: { x: 155, y: 155 },
  };

  const handleDotClick = (dotIndex: number) => {
    if (patternDots.includes(dotIndex)) return;
    const nextDots = [...patternDots, dotIndex];
    setPatternDots(nextDots);
    onChange('pattern', nextDots.join('-'));
  };

  const handleResetPattern = () => {
    setPatternDots([]);
    onChange('pattern', '');
  };

  const pointsString = patternDots
    .map((dot) => `${dotCoords[dot].x},${dotCoords[dot].y}`)
    .join(' ');

  return (
    <div className="space-y-3">
      {/* Type Selector Tabs */}
      <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <button
          type="button"
          onClick={() => onChange('pin', lockCode && lockCode !== 'NO_LOCK' ? lockCode : '1234')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            lockType === 'pin'
              ? 'bg-white dark:bg-zinc-800 text-brand-600 dark:text-brand-400 shadow-sm'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>Numeric PIN</span>
        </button>

        <button
          type="button"
          onClick={() => {
            const code = patternDots.join('-') || '1-4-7-8';
            onChange('pattern', code);
            if (patternDots.length === 0) setPatternDots([1, 4, 7, 8]);
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            lockType === 'pattern'
              ? 'bg-white dark:bg-zinc-800 text-brand-600 dark:text-brand-400 shadow-sm'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>3x3 Pattern</span>
        </button>

        <button
          type="button"
          onClick={() => onChange('none', 'NO_LOCK')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            lockType === 'none'
              ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>No Lock / Swipe</span>
        </button>
      </div>

      {/* Mode View: PIN Keypad */}
      {lockType === 'pin' && (
        <div className="p-4 bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Screen Unlock PIN
            </label>
            <span className="text-[10px] text-zinc-500 font-medium">Used for hardware testing</span>
          </div>

          <input
            type="text"
            value={lockCode === 'NO_LOCK' ? '' : lockCode}
            onChange={(e) => onChange('pin', e.target.value)}
            placeholder="e.g. 1234 or 0000"
            maxLength={8}
            className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 text-base font-mono font-bold tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-brand-500/50 shadow-inner"
          />

          <div className="grid grid-cols-3 gap-1.5 max-w-[200px] mx-auto pt-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'Clear', 0, 'Back'].map((btn, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  if (btn === 'Clear') onChange('pin', '');
                  else if (btn === 'Back') onChange('pin', lockCode.slice(0, -1));
                  else if (lockCode.length < 8) onChange('pin', (lockCode === 'NO_LOCK' ? '' : lockCode) + btn);
                }}
                className="py-2 text-xs font-mono font-bold rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-95 transition-all shadow-sm"
              >
                {btn}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mode View: Interactive 3x3 Visual Pattern */}
      {lockType === 'pattern' && (
        <div className="p-4 bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Pattern:{' '}
              {patternDots.length > 0 ? (
                <span className="font-mono text-brand-600 dark:text-brand-400 font-bold ml-1">
                  {patternDots.join(' → ')}
                </span>
              ) : (
                <span className="text-zinc-400 font-normal ml-1">Click dots to draw</span>
              )}
            </span>
            <button
              type="button"
              onClick={handleResetPattern}
              className="flex items-center gap-1 text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 rounded-md transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Interactive Pattern Visualizer with connecting beam */}
          <div className="relative w-[190px] h-[190px] mx-auto bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-inner overflow-hidden select-none">
            {/* SVG Connecting Beam */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              {patternDots.length > 1 && (
                <polyline
                  points={pointsString}
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-80"
                />
              )}
            </svg>

            {/* 3x3 Dot Grid */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 place-items-center p-3 z-10">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((dot) => {
                const selectedIndex = patternDots.indexOf(dot);
                const isSelected = selectedIndex !== -1;

                return (
                  <button
                    key={dot}
                    type="button"
                    onClick={() => handleDotClick(dot)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 relative group cursor-pointer ${
                      isSelected
                        ? 'bg-brand-600 text-white shadow-md shadow-brand-500/50 ring-4 ring-brand-500/25 font-bold scale-110'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:scale-105 border border-zinc-200 dark:border-zinc-700'
                    }`}
                  >
                    <span className="text-xs font-mono font-bold">
                      {isSelected ? selectedIndex + 1 : dot}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <p className="text-[11px] text-center text-zinc-500">
            Click dots in order to draw lock sequence. Stored on service tag sticker.
          </p>
        </div>
      )}

      {/* Mode View: None */}
      {lockType === 'none' && (
        <div className="p-4 bg-zinc-50 dark:bg-zinc-950/40 rounded-xl border border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-500">
          Device has no passcode lock enabled.
        </div>
      )}
    </div>
  );
};
