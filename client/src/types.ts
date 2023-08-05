export interface Question {
  id: string
  question: string
  options: Option[]
}

export interface Option {
  id: string
  value: string
}

export type SelectedOptions = Record<Question["id"], Option["id"] | null>

export interface Results {
  time: string
  correctAmount: number
  totalAmount: number
  questions: {
    question: string
    correctAnswer: string
    yourAnswer: string
    isCorrect: boolean
  }[]
}
