import { smoothPath } from "./smooth-path";

import { createCircle, createRect } from "./svg";

const randomBetween = (a, b) => {
  const [min, max] = [a, b].sort();

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generatePoints = ({ x, y, width, height, maxPoints, sorting }) => {
  const axis = sorting.replace("-", "");
  const distanceX = width / maxPoints;
  const distanceY = height / maxPoints;

  const points = [];

  let currentX = axis === "y" ? x + width / 2 : x + distanceX / 2;
  let currentY = axis === "x" ? y + height / 2 : y + distanceY / 2;

  const randX = axis === "x" ? 0 : distanceX / 3;
  const randY = axis === "y" ? 0 : distanceY / 3;

  for (let i = 0; i < maxPoints; i += 1) {
    points.push([
      currentX + randomBetween(-randX, randX),
      currentY + randomBetween(-randY, randY)
    ]);

    currentX += axis === "x" ? distanceX : 0;
    currentY += axis === "y" ? distanceY : 0;
  }

  return points;
};

const generate = ({
  svg,
  element,
  width,
  height,
  textWidth,
  textHeight,
  padding,
  debug
}) => {
  const top = (height - textHeight) / 2;
  const left = (width - textWidth) / 2;

  const boxHeight = top - padding / 2;

  const sideBoxWidth = left / 2;
  const sideBoxHeight = height / 2;

  const boxes = [
    {
      x: left,
      y: padding / 2,
      width: textWidth,
      height: boxHeight,
      maxPoints: 3,
      debugColor: "purple",
      sorting: "x"
    },
    {
      x: width - left,
      y: (height - sideBoxHeight) / 2,
      width: sideBoxWidth,
      height: sideBoxHeight,
      maxPoints: 3,
      sorting: "y"
    },
    {
      x: left,
      y: height - top,
      width: textWidth,
      height: boxHeight,
      maxPoints: 2,
      sorting: "-x"
    },
    {
      x: left - sideBoxWidth,
      y: (height - sideBoxHeight) / 2,
      width: sideBoxWidth,
      height: sideBoxHeight,
      maxPoints: 3,
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
          fill: box.debugColor || "blue",
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

  const bbox = tweet.getBoundingClientRect();

  const padding = 80;

  const { width, height } = bbox;

  const wrapperWidth = width + padding * 2;
  const wrapperHeight = height + padding * 2;

  svg.setAttribute("viewbox", `0 0 ${wrapperWidth} ${wrapperHeight}`);
  svg.style.width = `${wrapperWidth}px`;
  svg.style.height = `${wrapperHeight}px`;

  svg.innerHTML = `<defs>
    <linearGradient id="linear" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   stop-color="#05a"/>
      <stop offset="100%" stop-color="#0a5"/>
    </linearGradient>
  </defs>`;

  const path = generate({
    svg,
    element: tweet,
    width: wrapperWidth,
    height: wrapperHeight,
    textWidth: width,
    textHeight: height,
    padding: padding,
    debug
  });

  svg.appendChild(path);
};
