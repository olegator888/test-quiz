import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";
import {Data, Results, SelectedOptions} from "types";

const dataPath = "./db.json";
const PORT = 8000;

const { questions, correctAnswers }: Data = JSON.parse(fs.readFileSync(dataPath));

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.get("/questions", (req, res) => {
    res.json(questions)
});

/*
* export interface Results {
  correctAmount: number
  totalAmount: number
  questions: {
    question: string
    correctAnswer: string
    yourAnswer: string
    isCorrect: boolean
  }[]
}
*
*
*
* */

app.post("/check", (req: Request<{}, {}, SelectedOptions>, res) => {
    const results: Results = {
        correctAmount: 0,
        totalAmount: Object.keys(req.body).length,
        questions: []
    };

    Object.entries(req.body).forEach(([questionId, optionId]) => {
        const matchingQuestion = questions.find(question => question.id === questionId)!;

        const question = matchingQuestion.question;
        const correctAnswer = matchingQuestion.options.find(option => option.id === correctAnswers[questionId])!.value;
        const yourAnswer = optionId === null ? "Нет ответа" : matchingQuestion.options.find(option => option.id === optionId)!.value;
        const isCorrect = correctAnswers[questionId] === optionId;

        if (isCorrect) {
            results.correctAmount += 1;
        }

        results.questions.push({
            question,
            correctAnswer,
            yourAnswer,
            isCorrect
        });
    });

    res.json(results)
});

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
})
