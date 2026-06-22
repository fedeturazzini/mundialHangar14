'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TOURNAMENT_DATE } from '@/lib/data';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(): TimeLeft {
  const diff = TOURNAMENT_DATE.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const days    = Math.floor(diff / 86400000);
  const hours   = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds };
}

function Unit({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, '0');
  return (
    <div className="flex flex-col items-center gap-1">
      <AnimatePresence mode="wait">
        <motion.span
          key={display}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.18 }}
          className="text-2xl sm:text-3xl font-semibold tabular-nums"
          style={{ color: '#C9A84C' }}
        >
          {display}
        </motion.span>
      </AnimatePresence>
      <span className="text-[10px] uppercase tracking-widest text-white/30">{label}</span>
    </div>
  );
}

export default function Countdown() {
  const [time, setTime] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTime(getTimeLeft());
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) return <div className="h-14" />;

  const done = time.days === 0 && time.hours === 0 && time.minutes === 0 && time.seconds === 0;

  if (done) {
    return (
      <p className="text-xs text-white/40 tracking-widest uppercase text-center py-3">
        ¡El torneo ya comenzó!
      </p>
    );
  }

  return (
    <div className="flex items-center justify-center gap-5 py-4">
      <Unit value={time.days}    label="días" />
      <span className="text-white/20 text-xl mb-4">·</span>
      <Unit value={time.hours}   label="hs" />
      <span className="text-white/20 text-xl mb-4">·</span>
      <Unit value={time.minutes} label="min" />
      <span className="text-white/20 text-xl mb-4">·</span>
      <Unit value={time.seconds} label="seg" />
    </div>
  );
}
