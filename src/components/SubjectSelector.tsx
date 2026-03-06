import React from 'react';
import { motion } from 'motion/react';
import { Subject } from '../types';
import { Calculator, Beaker, Globe, BookOpen, Languages, GraduationCap } from 'lucide-react';
import { cn } from '../utils';

const subjects: { name: Subject; icon: any; color: string }[] = [
  { name: 'Matematika', icon: Calculator, color: 'bg-blue-500' },
  { name: 'IPA', icon: Beaker, color: 'bg-green-500' },
  { name: 'IPS', icon: Globe, color: 'bg-orange-500' },
  { name: 'Bahasa Indonesia', icon: BookOpen, color: 'bg-red-500' },
  { name: 'Bahasa Inggris', icon: Languages, color: 'bg-purple-500' },
];

interface SubjectSelectorProps {
  onSelect: (subject: Subject) => void;
}

export const SubjectSelector: React.FC<SubjectSelectorProps> = ({ onSelect }) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-block p-4 rounded-full bg-brand-primary/10 mb-4"
        >
          <GraduationCap className="w-12 h-12 text-brand-primary" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-800 mb-4">
          Halo, Adik-adik! 👋
        </h1>
        <p className="text-xl text-gray-600">
          Pilih mata pelajaran yang ingin kamu pelajari hari ini:
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject, index) => (
          <motion.button
            key={subject.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelect(subject.name)}
            className="group relative p-8 rounded-3xl bg-white border-2 border-transparent hover:border-brand-primary shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center overflow-hidden"
          >
            <div className={cn(
              "p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300",
              subject.color,
              "bg-opacity-10"
            )}>
              <subject.icon className={cn("w-10 h-10", `text-${subject.color.split('-')[1]}-500`)} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{subject.name}</h3>
            <p className="text-sm text-gray-500">Latihan soal seru & interaktif</p>
            
            <div className="absolute bottom-0 left-0 w-full h-1 bg-brand-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          </motion.button>
        ))}
      </div>
    </div>
  );
};
