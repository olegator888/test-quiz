export const getTime = (time: number) => {
  const seconds = (time > 59 ? time % 60 : time).toString().padStart(2, "0");
  const minutes = Math.floor(time / 60).toString().padStart(2, "0");

  return `${minutes}:${seconds}`;
};
