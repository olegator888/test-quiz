import { AnimatePresence, motion } from 'framer-motion';
import style from "./index.module.scss";
import {Results} from "types";
import AnswerIcon from "AnswerIcon";
import classNames from "utils/classNames";

interface Props {
  results?: Results
  isOpen: boolean
  onClose: () => void
}

export default function ResultsModal(props: Props) {
  const {
    isOpen,
    onClose,
    results
  } = props;

  let content;

  if (results) {
    const { correctAmount, totalAmount, questions, time } = results;

    content = (
      <div className={style.results}>
        <div className={style.results__time}>
          {time}
        </div>
        <h3 className={style.results__title}>
          Вы правильно ответили на <b>{correctAmount}</b> из <b>{totalAmount}</b> вопросов
        </h3>
        <div className={style.results__items}>
          {questions.map((question, i) => (
            <div key={i} className={style.item}>
              <h3 className={style.item__title}>
                <span>{question.question}</span>
                <AnswerIcon isCorrect={question.isCorrect} />
              </h3>
              <div className={style.item__answers}>
                <div className={classNames(
                  style.answer,
                  question.isCorrect && style.isCorrect,
                  !question.isCorrect && style.isWrong,
                )}>
                  <h4 className={style.answer__title}>
                    Ваш ответ:
                  </h4>
                  <p className={style.answer__text}>
                    {question.yourAnswer}
                  </p>
                </div>
                {!question.isCorrect && (
                  <div className={classNames(
                    style.answer,
                    style.isCorrect,
                  )}>
                    <h4 className={style.answer__title}>
                      Правильный ответ:
                    </h4>
                    <p className={style.answer__text}>
                      {question.correctAnswer}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!results) {
    content = (
      <div className={style.results}>
        Произошла ошибка
      </div>
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.2,
            ease: 'easeInOut',
          }}
        >
          <div onClick={onClose} className={style.overlay}>
            <div onClick={(e) => e.stopPropagation()} className={style.content}>
              <h2 className={style.title}>
                Результаты теста
              </h2>
              {content}
              <button
                className={style.close}
                onClick={onClose}
              >
                Закрыть
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
