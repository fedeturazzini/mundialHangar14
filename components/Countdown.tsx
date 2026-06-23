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

function Dots() {
  return (
    <div className="flex flex-col gap-2 mb-4 flex-shrink-0">
      <div className="w-1 h-1 rounded-full" style={{ background: 'rgba(201,168,76,0.4)' }} />
      <div className="w-1 h-1 rounded-full" style={{ background: 'rgba(201,168,76,0.4)' }} />
    </div>
  );
}

function Unit({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, '0');
  return (
    <div className="flex flex-col items-center">
      <AnimatePresence mode="wait">
        <motion.span
          key={display}
          initial={{ opacity: 0, y: -10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.9 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="font-black tabular-nums leading-none"
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            color: '#C9A84C',
            textShadow: '0 0 40px rgba(201,168,76,0.25)',
          }}
        >
          {display}
        </motion.span>
      </AnimatePresence>
      <span className="text-[10px] uppercase tracking-[0.25em] text-white/25 mt-1 font-medium">
        {label}
      </span>
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

  if (!time) return <div className="h-32" />;

  const done = time.days === 0 && time.hours === 0 && time.minutes === 0 && time.seconds === 0;

  if (done) {
    return (
      <div
        className="mt-6 mb-2 rounded-2xl py-6 px-4 text-center"
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
      >
        <p className="text-sm text-white/40 tracking-widest uppercase">¡El torneo ya comenzó!</p>
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center mt-6 mb-2 rounded-2xl py-6 px-4 lg:px-10"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <Unit value={time.days}    label="días" />
      <div className="mx-4 lg:mx-8"><Dots /></div>
      <Unit value={time.hours}   label="horas" />
      <div className="mx-4 lg:mx-8"><Dots /></div>
      <Unit value={time.minutes} label="min" />
      <div className="mx-4 lg:mx-8"><Dots /></div>
      <Unit value={time.seconds} label="seg" />
    </div>
  );
}
