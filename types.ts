
export enum HPCategory {
  NARRATIVE = 'Narrative HP',
  QUOTATIVE = 'Quotative HP',
  EPISODIC = 'Episodic HP',
  VISUALIZING = 'Visualizing HP',
  INTERNAL_EVAL = 'Internal Evaluation',
  NONE = 'None'
}

export enum Tense {
  PAST = 'Past',
  PRESENT_HP = 'Historical Present',
  FUTURE = 'Future',
  HABITUAL = 'Habitual'
}

export interface SentenceAnalysis {
  originalText: string;
  inferredTense: Tense;
  omittedElements: string; 
  hpCategory: HPCategory;
  reasoning: string;
  contextualMetadata: string;
  position: number;
}

export interface AnalysisResponse {
  summary: {
    totalSentences: number;
    hpCount: number;
    tenseSwitchRatio: number;
  };
  qualitativeAnalysis: string; 
  sentences: SentenceAnalysis[];
}
