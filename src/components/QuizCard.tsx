import React from 'react';
import { motion } from 'motion/react';
import { Question } from '../types';
import { cn } from '../utils';
import { Check, X, Info } from 'lucide-react';

interface QuizCardProps {
  question: Question;
  selectedAnswer: number | null;
  onSelectAnswer: (index: number) => void;
  showExplanation: boolean;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  selectedAnswer,
  onSelectAnswer,
  showExplanation,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-2xl mx-auto p-6 rounded-3xl glass-card shadow-xl"
    >
      <div className="mb-6">
        <span className="px-3 py-1 rounded-full bg-brand-secondary/20 text-brand-secondary text-sm font-bold uppercase tracking-wider">
          {question.subject} • {question.difficulty}
        </span>
        <h2 className="mt-4 text-2xl font-display font-bold text-gray-800 leading-tight">
          {question.text}
        </h2>
      </div>

      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === question.correctAnswer;
          const showResult = showExplanation;

          let variantClasses = "bg-white hover:bg-gray-50 border-gray-100";
          if (showResult) {
            if (isCorrect) variantClasses = "bg-green-100 border-green-500 text-green-700";
            else if (isSelected) variantClasses = "bg-red-100 border-red-500 text-red-700";
          } else if (isSelected) {
            variantClasses = "bg-brand-primary/10 border-brand-primary text-brand-primary";
          }

          return (
            <button
              key={index}
              disabled={showExplanation}
              onClick={() => onSelectAnswer(index)}
              className={cn(
                "w-full p-4 text-left rounded-2xl border-2 transition-all duration-200 flex items-center justify-between group",
                variantClasses,
                !showExplanation && "hover:scale-[1.02] active:scale-[0.98]"
              )}
            >
              <span className="text-lg font-medium">{option}</span>
              {showResult && isCorrect && <Check className="w-6 h-6 text-green-600" />}
              {showResult && isSelected && !isCorrect && <X className="w-6 h-6 text-red-600" />}
            </button>
          );
        })}
      </div>

      {showExplanation && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-6 p-4 rounded-2xl bg-brand-accent/20 border border-brand-accent/30"
        >
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-brand-primary mt-1 shrink-0" />
            <div>
              <p className="font-bold text-brand-primary mb-1">Penjelasan AI Tutor:</p>
              <p className="text-gray-700 leading-relaxed">{question.explanation}</p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
