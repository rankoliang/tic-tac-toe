const board = (size) => {
  const element = document.querySelector("#board");

  const getSize = () => size;

  const pieces = arrayHelper.multiDimensionalArray(getSize(), getSize());

  const reset = function () {
    for (let row = 0; row < getSize(); row++) {
      for (let column = 0; column < getSize(); column++) {
        pieces[row][column] = piece(...elementBorders(row, column));
      }
    }
    return this;
  };

  const elementBorders = (row, column) => {
    const borders = [];
    if (row !== 0) {
      borders.push("border-t");
    }
    if (row !== getSize() - 1) {
      borders.push("border-b");
    }
    if (column !== 0) {
      borders.push("border-l");
    }
    if (column !== getSize() - 1) {
      borders.push("border-r");
    }
    return borders;
  };

  let currentPlayer = 1;

  const switchPlayer = () => {
    if (currentPlayer === 1) {
      currentPlayer = 2;
    } else {
      currentPlayer = 1;
    }
  };

  const render = () => {
    // remove all child nodes
    while (element.hasChildNodes()) {
      element.removeChild(element.firstChild);
    }
    // render each piece
    const winner = _winner();
    for (const [horizontalIndex, row] of pieces.entries()) {
      for (const [verticalIndex, piece] of row.entries()) {
        if (!winner) {
          element.appendChild(
            piece.element(currentPlayer, () => {
              {
                switchPlayer();
                render();
              }
            })
          );
        } else {
          const pieceElement = piece.element();
          if (
            (winner.direction == "horizontal" && horizontalIndex == winner.rowIndex) ||
            (winner.direction == "vertical" && verticalIndex == winner.rowIndex)
          ) {
            pieceElement.classList.add("bg-gray-300");
          }
          element.appendChild(pieceElement);
        }
      }
    }
    if (winner) {
      console.log(winner);
    }
  };

  const _winner = () => {
    const rows = {
      horizontal: pieces,
      vertical: arrayHelper.transposeArray(pieces),
      diagonal: arrayHelper.diagonals(pieces),
    };

    for (const direction of Object.keys(rows)) {
      for (let i = 0; i < rows[direction].length; i++) {
        const winningPlayer = arrayHelper.checkUniformity(rows[direction][i]);
        if (winningPlayer) {
          return {
            player: winningPlayer,
            direction: direction,
            rowIndex: i,
          };
        }
      }
    }

    return false;
  };

  return { getSize, element, render, pieces, switchPlayer, currentPlayer, reset };
};

const piece = (...classes) => {
  let player;

  const shape = {
    1: "cross",
    2: "circle",
  };

  const setPlayer = (playerNumber) => {
    player = playerNumber;
  };

  const getPlayer = () => player;

  const element = (playerNumber, onClick) => {
    const playerToken = shape[player] && svg.element(shape[player]);
    const piece = elementHelper.piece(
      playerToken,
      ...["border-gray-600", "flex", "justify-center", "items-center", "text-6-xl"].concat(classes)
    );
    if (!player && onClick) {
      piece.addEventListener("click", setPlayer.bind(this, playerNumber));
      piece.addEventListener("click", onClick);
    }
    return piece;
  };
  return { element, setPlayer, getPlayer };
};

const elementHelper = (() => {
  const piece = (img, ...classes) => {
    const element = () => {
      const element = document.createElement("div");
      element.style.paddingTop = "50%";
      element.style.paddingBottom = "50%";
      element.style.height = "0px";
      element.classList.add(...classes);
      img && element.appendChild(img);

      return element;
    };

    return element();
  };
  const svg = (pathCommands, styles, ...classes) => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 16 16");
    svg.setAttribute("fill", "currentColor");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    for (const [style, value] of Object.entries(styles)) {
      svg.style[style] = value;
    }
    svg.classList.add(...classes);
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("fill-rule", "evenodd");
    path.setAttribute("d", pathCommands);
    svg.appendChild(path);

    return svg;
  };

  return { piece, svg };
})();

const arrayHelper = (() => {
  const multiDimensionalArray = (rows, columns) => {
    const arr = new Array(rows);

    for (let i = 0; i < arr.length; i++) {
      arr[i] = new Array(columns);
    }
    return arr;
  };

  const checkUniformity = (array) => {
    const referencePiece = array[0];
    if (array.filter((piece) => piece.getPlayer() === referencePiece.getPlayer()).length === array.length) {
      return referencePiece.getPlayer();
    }
    return false;
  };

  const transposeArray = (array) => {
    const transposedArray = multiDimensionalArray(array[0].length, array.length);
    for (const [rowIndex, row] of array.entries()) {
      for (const [columnIndex] of row.entries()) {
        transposedArray[columnIndex][rowIndex] = array[rowIndex][columnIndex];
      }
    }
    return transposedArray;
  };

  const diagonals = (array) => {
    const diagonals = multiDimensionalArray(2, array.length);
    for (let i = 0; i < array.length; i++) {
      diagonals[0][i] = array[i][i];
      diagonals[1][i] = array[i][array.length - i - 1];
    }
    return diagonals;
  };

  return {
    multiDimensionalArray,
    checkUniformity,
    transposeArray,
    diagonals,
  };
})();

const svg = (() => {
  const svgOptions = {
    cross: {
      path:
        "M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z",
      styles: { width: "100%" },
      classes: ["text-blue-500"],
    },
    circle: {
      path: "M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z",
      styles: { width: "50%" },
      classes: ["text-yellow-500"],
    },
  };

  const element = (shape, ...classes) => {
    const shapeOptions = svgOptions[shape];
    return elementHelper.svg(shapeOptions.path, shapeOptions.styles, ...shapeOptions.classes.concat(classes));
  };
  return { element };
})();

(function () {
  const tttBoard = board(3).reset();
  tttBoard.render();
  const test = [
    [1, 2],
    [3, 4],
    [5, 6],
  ];
  console.log(test);
  console.log(arrayHelper.transposeArray(test));
  const square = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ];
  console.log(arrayHelper.diagonals(square));
  // console.log(tttBoard.pieces);
  // console.log(arrayHelper.transposeArray(tttBoard.pieces));
})();
