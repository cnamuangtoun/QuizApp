export interface IChoice {
    id: number;
    text: string;
  }
  
export interface IQuestion {
  id: number;
  text: string;
  text_answer: string;
  question_type: 'S' | 'M' | 'T';
  choices: IChoice[];
}

export interface IQuiz {
  id: number;
  title: string;
  questions: IQuestion[];
}

export interface IAnswer {
  [key: number]: number[];
}

export interface QuizStat {
  user: {
      username: string;
  };
  quiz: {
      title: string;
  };
  score: number;
  completed: boolean;
}