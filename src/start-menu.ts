import startGame from "./main";
import { State } from "./state/state";

const input = document.getElementById("name") as HTMLInputElement;

const setName = () => {
  const name = input.value;
  if (!name) return alert("ingresa un nombre");
  window.localStorage.setItem("name", name);
  startGame();
  document.getElementById("menu")?.classList.add("hidden");
};

const handleStart = () => {
  setName();
};

const dialogLogic = () => {
  const options = document.getElementById("options") as HTMLDivElement;

  options.addEventListener("click", (e) => {
    e.preventDefault();

    const target = e.target as HTMLButtonElement;

    if (target.tagName === "BUTTON") {
      const answer = window.localStorage.getItem("answer");
      console.log(answer, target.textContent);
      if (answer === target.textContent) {
        State.getInstance().socket.emit("sum-score", {
          id: State.getInstance().socket.id,
          points: 10,
        });

        State.getInstance().addPoints(State.getInstance().socket.id, 10);
        State.getInstance().updatePlayerScoreTop();
        //say good job
        options.innerHTML += "<p>Good job!</p>";
      } else {
        //say bad answer
        options.innerHTML += "<p>Bad answer!</p>";
      }
      setTimeout(() => {
        options.innerHTML = "";
        document.getElementById("dialog")?.classList.add("hidden");
      }, 1000);
    }
  });
};

const start = document.getElementById("start") as HTMLButtonElement;
start.addEventListener("click", () => {
  handleStart();
  dialogLogic();
});
