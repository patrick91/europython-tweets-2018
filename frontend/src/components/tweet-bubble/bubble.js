import { smoothPath } from "./smooth-path";

import { createCircle, createRect } from "./svg";

const randomBetween = (a, b) => {
  const [min, max] = [a, b].sort();

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generatePoints = ({ x, y, width, height, maxPoints, sorting }) => {
  const axis = sorting.replace("-", "");

  const length = axis === "x" ? width : height;
  const distance = length / maxPoints;

  const points = [];

  const paddingX = 40;
  const paddingY = 20;

  let startDeltaX = 0;
  let startDeltaY = 0;
  let multX = 1;
  let multY = 1;

  switch (
    sorting // eslint-disable-line
  ) {
    case "y":
      startDeltaX = paddingY;
      break;
    case "-y":
      multX = -1;
      startDeltaX = width;
      break;
    case "x":
      multY = -1;
      startDeltaY = height - paddingX;
      break;
    case "-x":
      startDeltaY = paddingX;
      break;
  }

  let currentX = x + (axis === "y" ? startDeltaX : -distance / 2);
  let currentY = y + (axis === "x" ? startDeltaY : -distance / 2);

  for (let i = 0; i < maxPoints; i += 1) {
    currentX += axis === "x" ? distance : 0;
    currentY += axis === "y" ? distance : 0;

    points.push([
      currentX + multX * randomBetween(0, paddingX),
      currentY + multY * randomBetween(0, paddingY)
    ]);
  }

  return points;
};

const generate = ({ svg, element, width, height, textWidth, debug }) => {
  const elementBBox = element.getBoundingClientRect();

  const textHeight = elementBBox.height;

  const top = (height - textHeight) / 2;
  const left = (width - textWidth) / 2;

  const boxes = [
    {
      x: left,
      y: 0,
      width: textWidth,
      height: top,
      maxPoints: 3,
      sorting: "x"
    },
    {
      x: width - left,
      y: top - 20,
      width: left,
      height: textHeight + 40,
      maxPoints: 2,
      sorting: "y"
    },
    {
      x: left,
      y: height - top,
      width: textWidth,
      height: top,
      maxPoints: 2,
      sorting: "-x"
    },
    {
      x: 0,
      y: top - 20,
      width: left,
      height: textHeight + 40,
      maxPoints: 2,
      sorting: "-y",
      fill: "yellow"
    }
  ];

  const points = [];

  for (const box of boxes) {
    const boxPoints = generatePoints(box);

    if (debug) {
      svg.appendChild(
        createRect({
          fill: "blue",
          ...box
        })
      );
    }

    boxPoints.sort((a, b) => {
      if (box.sorting.startsWith("-")) {
        [b, a] = [a, b];
      }

      const axis = box.sorting.replace("-", "");
      const index = axis === "x" ? 0 : 1;

      return a[index] - b[index];
    });

    points.push(...boxPoints);
  }

  if (debug) {
    for (const point of points) {
      svg.appendChild(
        createCircle({
          x: point[0],
          y: point[1]
        })
      );
    }
  }

  return smoothPath({ points: points });
};

export const createBubble = (svg, tweet, debug = false) => {
  while (svg.firstChild) {
    svg.removeChild(svg.firstChild);
  }

  const bbox = svg.getBoundingClientRect();

  const { width, height } = bbox;

  svg.setAttribute("viewbox", `0 0 ${width} ${height}`);

  const textWidth = width - 200;

  tweet.style.width = `${textWidth - 150}px`;

  svg.innerHTML = `<defs>
    <linearGradient id="linear" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   stop-color="#05a"/>
      <stop offset="100%" stop-color="#0a5"/>
    </linearGradient>
  </defs>`;

  const path = generate({
    svg,
    element: tweet,
    width,
    height,
    textWidth,
    debug
  });

  svg.appendChild(path);
};
