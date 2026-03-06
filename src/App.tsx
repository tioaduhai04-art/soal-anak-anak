import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Subject, Question, QuizState } from './types';
import { generateQuestions } from './services/gemini';
import { SubjectSelector } from './components/SubjectSelector';
import { QuizCard } from './components/QuizCard';
import { Results } from './components/Results';
import { Loader2, ArrowRight, Sparkles, ChevronLeft } from 'lucide-react';

export default function App() {
  const [state, setState] = useState<QuizState>({
    currentQuestionIndex: 0,
    score: 0,
    answers: [],
    isFinished: false,
    questions: [],
    selectedSubject: null,
    isLoading: false,
  });

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleSubjectSelect = async (subject: Subject) => {
    setState(prev => ({ ...prev, isLoading: true, selectedSubject: subject }));
    try {
      const questions = await generateQuestions(subject);
      setState(prev => ({ ...prev, questions, isLoading: false }));
    } catch (error) {
      console.error("Failed to load questions", error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleAnswerSelect = (index: number) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
    setShowExplanation(true);

    const isCorrect = index === state.questions[state.currentQuestionIndex].correctAnswer;
    if (isCorrect) {
      setState(prev => ({ ...prev, score: prev.score + 1 }));
    }
  };

  const handleNext = () => {
    const nextIndex = state.currentQuestionIndex + 1;
    if (nextIndex < state.questions.length) {
      setState(prev => ({ ...prev, currentQuestionIndex: nextIndex }));
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setState(prev => ({ ...prev, isFinished: true }));
    }
  };

  const resetQuiz = () => {
    if (state.selectedSubject) {
      handleSubjectSelect(state.selectedSubject);
    }
    setState(prev => ({
      ...prev,
      currentQuestionIndex: 0,
      score: 0,
      answers: [],
      isFinished: false,
    }));
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const goHome = () => {
    setState({
      currentQuestionIndex: 0,
      score: 0,
      answers: [],
      isFinished: false,
      questions: [],
      selectedSubject: null,
      isLoading: false,
    });
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  return (
    <div className="min-h-screen font-sans">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-display font-bold text-gray-800 hidden sm:block">
            Soal SD Pintar
          </span>
        </div>

        {state.selectedSubject && !state.isFinished && !state.isLoading && (
          <div className="flex items-center gap-4">
            <div className="bg-white/80 backdrop-blur px-4 py-2 rounded-2xl shadow-sm border border-white flex items-center gap-3">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Progres</div>
              <div className="flex gap-1">
                {state.questions.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i === state.currentQuestionIndex
                        ? 'bg-brand-primary w-6'
                        : i < state.currentQuestionIndex
                        ? 'bg-brand-secondary'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
            <button 
              onClick={goHome}
              className="p-2 rounded-xl bg-white/80 hover:bg-white shadow-sm border border-white text-gray-500 hover:text-brand-primary transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>
        )}
      </header>

      <main className="pt-24 pb-12 px-6">
        <AnimatePresence mode="wait">
          {state.isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[60vh] text-center"
            >
              <div className="relative">
                <Loader2 className="w-16 h-16 text-brand-primary animate-spin" />
                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-brand-accent animate-pulse" />
              </div>
              <h2 className="mt-6 text-2xl font-display font-bold text-gray-800">
                Menyiapkan Soal Seru...
              </h2>
              <p className="mt-2 text-gray-500">AI Tutor sedang berpikir sejenak</p>
            </motion.div>
          ) : !state.selectedSubject ? (
            <SubjectSelector key="selector" onSelect={handleSubjectSelect} />
          ) : state.isFinished ? (
            <Results
              key="results"
              score={state.score}
              total={state.questions.length}
              subject={state.selectedSubject}
              onRestart={resetQuiz}
              onHome={goHome}
            />
          ) : state.questions.length > 0 ? (
            <div key="quiz" className="flex flex-col items-center">
              <QuizCard
                question={state.questions[state.currentQuestionIndex]}
                selectedAnswer={selectedAnswer}
                onSelectAnswer={handleAnswerSelect}
                showExplanation={showExplanation}
              />
              
              <AnimatePresence>
                {showExplanation && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onClick={handleNext}
                    className="mt-8 flex items-center gap-2 px-10 py-4 bg-brand-primary text-white rounded-2xl font-bold text-lg shadow-xl hover:scale-105 active:scale-95 transition-all"
                  >
                    {state.currentQuestionIndex === state.questions.length - 1 ? 'Lihat Hasil' : 'Soal Berikutnya'}
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          ) : null}
        </AnimatePresence>
      </main>

      {/* Footer Decoration */}
      <div className="fixed bottom-0 left-0 w-full pointer-events-none overflow-hidden h-32 opacity-20">
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-brand-primary rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-brand-secondary rounded-full blur-3xl" />
      </div>
    </div>
  );
}
