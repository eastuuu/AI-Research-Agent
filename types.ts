export enum AppStatus {
  IDLE = 'IDLE',
  GENERATING_QUESTIONS = 'GENERATING_QUESTIONS',
  RESEARCHING = 'RESEARCHING',
  COMPILING = 'COMPILING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export interface ResearchItem {
  question: string;
  answer: string;
}

export interface ReportState {
  topic: string;
  subQuestions: string[];
  researchData: ResearchItem[];
  finalReport: string;
  error?: string;
}

export interface StepStatus {
  id: number;
  label: string;
  status: 'pending' | 'loading' | 'completed';
}