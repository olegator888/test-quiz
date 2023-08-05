import { ReactComponent as TickIcon } from "assets/tick.svg";
import { ReactComponent as WrongIcon } from "assets/wrong.svg";
import style from "./index.module.scss";
import classNames from "utils/classNames";

interface Props {
  isCorrect: boolean
}

const AnswerIcon = ({ isCorrect }: Props) => {
  return (
    <div className={classNames(
      style.icon,
      isCorrect && style.isCorrect,
      !isCorrect && style.isWrong
    )}>
      {isCorrect ? (
        <TickIcon />
      ) : (
        <WrongIcon/>
      )}
    </div>
  );
};

export default AnswerIcon;
