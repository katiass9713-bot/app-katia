
export enum StudyObjective {
  CONTEST = 'CONTEST',
  RESIDENCY = 'RESIDENCY',
  GRADUATION = 'GRADUATION'
}

export enum Difficulty {
  EASY = 'Fácil',
  MEDIUM = 'Médio',
  HARD = 'Difícil',
  KILLER = 'Assassina'
}

export enum ExamBoard {
  ENARE = 'ENARE',
  FGV = 'FGV',
  VUNESP = 'VUNESP',
  FCC = 'FCC',
  IBFC = 'IBFC',
  CEBRASPE = 'CEBRASPE'
}

export enum ResidencyArea {
  OBSTETRICIA = 'Obstetrícia',
  UTI = 'UTI Adulto/Pediátrica',
  URGENCIA = 'Urgência e Emergência',
  CARDIOLOGIA = 'Cardiologia',
  ONCOLOGIA = 'Oncologia',
  SAUDE_FAMILIA = 'Saúde da Família',
  PEDIATRIA = 'Pediatria e Neonatologia',
  CIRURGICA = 'Centro Cirúrgico/CME'
}

export interface UserProfile {
  name: string;
  objective: StudyObjective | null;
  residencyArea: ResidencyArea | null;
  experienceLevel: string;
  studyTime: string;
  dailyCommitment: string;
  mainPainPoint: string;
  isPremium: boolean;
  subscriptionExpiry: string | null;
  questionsAnswered: number;
  correctAnswers: number;
  streak: number;
  maxStreak: number;
  // Segurança Avançada
  deviceIds: string[]; // Lista de IDs autorizados (max 2)
  isLocked?: boolean;
}

export interface Question {
  id: string;
  case: string;
  alternatives: string[];
  correctIndex: number;
  isTrueFalse?: boolean;
  explanation: string;
  katiaTip: string;
  difficulty: Difficulty;
  type: 'Theoretical' | 'Clinical';
}

export interface Simulation {
  questions: Question[];
  timeLimit: number;
  score: number;
  startTime: number;
}
