import style from "./App.module.scss";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import axios from "axios";
import Loader from "Loader";
import { Option, Question, Results, SelectedOptions } from "types";
import { ReactComponent as TickIcon } from "assets/tick.svg";
import classNames from "utils/classNames";
import ResultsModal from "ResultsModal";
import { getTime } from "utils/getTime";

axios.defaults.baseURL = "http://localhost:8000/";

const testTime = 300;

const App = () => {
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const [results, setResults] = useState<Results | undefined>();
  const [resultsModal, setResultsModal] = useState(false);
  const [time, setTime] = useState(testTime);
  const [testStarted, setTestStarted] = useState(false);

  const buttonText = submitting
    ? "Проверяем..."
    : testStarted
    ? "Закончить"
    : "Начать";
  const submitDisabled =
    (!Object.values(selectedOptions).some((value) => value) && testStarted) ||
    submitting;
  const timer = useRef() as MutableRefObject<ReturnType<typeof setTimeout>>;
  const buttonAction = testStarted ? finishTest : startTest;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data } = await axios.get<Question[]>("questions");

        setQuestions(data);
        resetAnswers(data);
      } catch (e) {
        console.log(e);
        setError(true);
      }

      setLoading(false);
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    if (time === 0) {
      finishTest();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);

  function startTest() {
    timer.current = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    setTestStarted(true);
  }

  function finishTest() {
    submit();
    clearInterval(timer.current);
    setTime(testTime);
    setTestStarted(false);
  }

  function resetAnswers(questions: Question[]) {
    const selectedOptions: SelectedOptions = {};
    questions.forEach((question) => {
      selectedOptions[question.id] = null;
    });

    setSelectedOptions(selectedOptions);
  }

  function openResultsModal() {
    setResultsModal(true);
  }

  function closeResultsModal() {
    setResultsModal(false);
  }

  function selectOption(questionId: Question["id"], optionId: Option["id"]) {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  }

  async function submit() {
    setSubmitting(true);

    const finalTime = testTime - time;

    try {
      const { data } = await axios.post<Omit<Results, "time">>(
        "check",
        selectedOptions
      );

      setResults({
        time: getTime(finalTime),
        ...data,
      });

      resetAnswers(questions);
      openResultsModal();
    } catch (e) {
      console.log(e);
      setError(true);
    }

    setSubmitting(false);
  }

  let content = (
    <div className={style.questionsContainer}>
      <div className={style.time}>{getTime(time)}</div>
      <div
        className={classNames(style.questions, !testStarted && style.disabled)}
      >
        {questions.map((question, i) => (
          <div key={question.id} className={style.question}>
            <h3 className={style.question__title}>
              {i + 1}. {question.question}
            </h3>
            <div className={style.question__options}>
              {question.options.map((option) => {
                const isSelected = option.id === selectedOptions[question.id];

                return (
                  <div
                    key={option.id}
                    className={style.option}
                    onClick={() => selectOption(question.id, option.id)}
                  >
                    <div
                      className={classNames(
                        style.option__mark,
                        isSelected && style.isSelected
                      )}
                    >
                      {isSelected && <TickIcon />}
                    </div>
                    <span>{option.value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <button
        className={style.submit}
        disabled={submitDisabled}
        onClick={buttonAction}
      >
        {buttonText}
      </button>
    </div>
  );

  if (loading) {
    content = <Loader />;
  }

  if (error) {
    content = (
      <div className={style.error}>
        <span>Произошла ошибка.</span>
        <button onClick={() => window.location.reload()}>
          Перезагрузить страницу
        </button>
      </div>
    );
  }

  return (
    <div className={style.app}>
      <h1 className={style.title}>Interesting Quiz</h1>
      {content}
      <ResultsModal
        results={results}
        isOpen={resultsModal}
        onClose={closeResultsModal}
      />
    </div>
  );
};

export default App;
