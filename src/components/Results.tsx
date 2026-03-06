import React from 'react';
import { motion } from 'motion/react';
import { Trophy, RotateCcw, Home, Star } from 'lucide-react';
import { Subject } from '../types';

interface ResultsProps {
  score: number;
  total: number;
  subject: Subject;
  onRestart: () => void;
  onHome: () => void;
}

export const Results: React.FC<ResultsProps> = ({ score, total, subject, onRestart, onHome }) => {
  const percentage = (score / total) * 100;
  
  let message = "Ayo coba lagi!";
  let iconColor = "text-orange-500";
  
  if (percentage === 100) {
    message = "Luar Biasa! Kamu Sempurna! 🌟";
    iconColor = "text-yellow-500";
  } else if (percentage >= 80) {
    message = "Hebat Sekali! Pertahankan! 🚀";
    iconColor = "text-yellow-400";
  } else if (percentage >= 60) {
    message = "Bagus! Terus Belajar Ya! 👍";
    iconColor = "text-blue-500";
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-xl mx-auto p-12 rounded-[3rem] glass-card shadow-2xl text-center"
    >
      <div className="relative inline-block mb-8">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Trophy className={`w-24 h-24 mx-auto ${iconColor}`} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute -top-4 -right-4"
        >
          <Star className="w-8 h-8 text-yellow-400 fill-current" />
        </motion.div>
      </div>

      <h2 className="text-4xl font-display font-bold text-gray-800 mb-2">
        Selesai!
      </h2>
      <p className="text-xl text-gray-600 mb-8">{message}</p>

      <div className="bg-white/50 rounded-3xl p-8 mb-8 border border-white">
        <div className="text-sm text-gray-500 uppercase tracking-widest mb-2">Skor Kamu</div>
        <div className="text-6xl font-display font-black text-brand-primary">
          {score} <span className="text-2xl text-gray-400">/ {total}</span>
        </div>
        <div className="mt-4 h-3 w-full bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            className="h-full bg-brand-primary"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onRestart}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-brand-primary text-white rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all shadow-lg"
        >
          <RotateCcw className="w-5 h-5" />
          Coba Lagi
        </button>
        <button
          onClick={onHome}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 border-2 border-gray-100 rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all shadow-md"
        >
          <Home className="w-5 h-5" />
          Menu Utama
        </button>
      </div>
    </motion.div>
  );
};
