export default (cb: Function) => {
  const input = document.getElementById("name") as HTMLInputElement;

  const setName = () => {
    const name = input.value;
    if (!name) return alert("ingresa un nombre");
    window.localStorage.setItem("name", name);
    cb();
    document.getElementById("menu")?.classList.add("hidden");
  };

  const handleStart = () => {
    setName();
  };

  const start = document.getElementById("start") as HTMLButtonElement;

  start.addEventListener("click", () => {
    handleStart();
  });
};
