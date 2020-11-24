(function () {
  const board = (size) => {
    const element = document.querySelector("#board");

    const getSize = () => size;
    const render = () => {
      for (let row = 0; row < getSize(); row++) {
        for (let column = 0; column < getSize(); column++) {
          const classList = [];
          if (row !== 0) {
            classList.push("border-t");
          }
          if (row !== getSize() - 1) {
            classList.push("border-b");
          }
          if (column !== 0) {
            classList.push("border-l");
          }
          if (column !== getSize() - 1) {
            classList.push("border-r");
          }
          let symbol;
          let symbolColor;
          if ((row + column) % 2 == 0) {
            symbol = "X";
            symbolColor = "text-blue-500";
          } else {
            symbol = "O";
            symbolColor = "text-yellow-500";
          }
          element.appendChild(
            piece(
              symbol,
              "border-gray-600",
              "flex",
              "justify-center",
              "items-center",
              "text-6xl",
              symbolColor,
              ...classList
            )
          );
        }
      }
    };

    return { getSize, element, render };
  };

  const piece = (content, ...classes) => {
    const element = () => {
      const element = document.createElement("div");
      element.style.paddingTop = "calc(50% - 1px)";
      element.style.paddingBottom = "calc(50% - 1px)";
      element.style.height = "0px";
      element.classList.add(...classes);
      element.textContent = content;

      return element;
    };

    return element();
  };

  board(3).render();
})();
