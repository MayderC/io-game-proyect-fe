export const getRandomOperation = () => {
  const operations = ["+", "-"];
  const randomIndex = Math.floor(Math.random() * operations.length);
  return operations[randomIndex];
};

const getThreeRandomNumbersTwice = () => {
  return {
    one: [
      Math.ceil(Math.random() * 10),
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
    ],
    two: [
      Math.ceil(Math.random() * 10),
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
    ],
  };
};

///format text for the question
const getOperation = () => {
  const { one, two } = getThreeRandomNumbersTwice();
  const operation = getRandomOperation();
  const op = one.join(",") + " " + operation + " " + two.join(",");
  return op.replace(/,/g, "");
};

const evaluate = (operation: string) => {
  return eval(operation);
};

const incorrectAnswer = (operation: string) => {
  return evaluate(operation) + Math.floor(Math.random() * 10);
};

const getAnswer = (operation: string) => {
  const answer = evaluate(operation);
  const incorrect = incorrectAnswer(operation);
  const anotherIncorrect = incorrectAnswer(operation);
  return [answer, incorrect, anotherIncorrect];
};

export const generateHtml = () => {
  const question = getOperation();
  const [answer, incorrect, anotherIncorrect] = getAnswer(question);
  const randIndex = Math.floor(Math.random() * 3);

  window.localStorage.setItem("answer", answer.toString());

  return htmlOptions(randIndex, question, [
    answer,
    incorrect,
    anotherIncorrect,
  ]);
};

const htmlOptions = (n: number, question: string, answers: number[]) => {
  const html1 = `
  <p class='question-id'>Cuanto es: ${question} ?</p>
  <div class='options'>
    <button>${answers[0]}</button>
    <button>${answers[1]}</button>
    <button>${answers[2]}</button>
  </div>
  `;
  const html2 = `
  <p class='question-id'>Cuanto es: ${question} ?</p>
  <div class='options'>
    <button>${answers[1]}</button>
    <button>${answers[0]}</button>
    <button>${answers[2]}</button>
  </div>`;

  const html3 = `
  <p class='question-id'>Cuanto es: ${question} ?</p>
  <div class='options'>
    <button>${answers[2]}</button>
    <button>${answers[1]}</button>
    <button>${answers[0]}</button>
  </div>`;

  const htmls = [html1, html2, html3];
  return htmls[n];
};
