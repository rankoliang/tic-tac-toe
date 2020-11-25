const board = (size) => {
  const element = document.querySelector("#board");

  const getSize = () => size;
  const render = () => {
    for (let row = 0; row < getSize(); row++) {
      for (let column = 0; column < getSize(); column++) {
        let shape;
        if ((row + column) % 2 == 0) {
          shape = "cross";
        } else {
          shape = "circle";
        }
        element.appendChild(piece(shape, ...elementBorders(row, column)));
      }
    }
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

  return { getSize, element, render };
};

const piece = (shape, ...classes) => {
  const element = elementHelper.piece(
    svg.element(shape),
    ...["border-gray-600", "flex", "justify-center", "items-center", "text-6-xl"].concat(classes)
  );
  return element;
};

const elementHelper = (() => {
  const piece = (img, ...classes) => {
    const element = () => {
      const element = document.createElement("div");
      element.style.paddingTop = "calc(50% - 1px)";
      element.style.paddingBottom = "calc(50% - 1px)";
      element.style.height = "0px";
      element.classList.add(...classes);
      element.appendChild(img);

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
  board(3).render();
})();
