export type Subject = 'Matematika' | 'IPA' | 'IPS' | 'Bahasa Indonesia' | 'Bahasa Inggris';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  subject: Subject;
  difficulty: 'Mudah' | 'Sedang' | 'Sulit';
}

export interface QuizState {
  currentQuestionIndex: number;
  score: number;
  answers: number[];
  isFinished: boolean;
  questions: Question[];
  selectedSubject: Subject | null;
  isLoading: boolean;
}
