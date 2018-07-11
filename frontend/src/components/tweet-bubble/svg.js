export const createLine = ({ x1, y1, x2, y2 }) => {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);
  line.setAttribute("stroke", "black");

  return line;
};

export const createRect = ({ x, y, width, height, fill }) => {
  const box = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  box.setAttribute("x", x);
  box.setAttribute("y", y);
  box.setAttribute("width", width);
  box.setAttribute("height", height);
  box.setAttribute("fill", fill);

  return box;
};

export const createCircle = ({ x, y }) => {
  const circle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  circle.setAttribute("cx", x);
  circle.setAttribute("cy", y);
  circle.setAttribute("r", 3);
  circle.setAttribute("fill", "red");

  return circle;
};

export const createPolygon = ({ points }) => {
  const polygon = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "polygon"
  );

  const pointsString = points.map(point => point.join(",")).join(" ");

  polygon.setAttribute("points", pointsString);
  polygon.setAttribute("stroke", "purple");

  return polygon;
};

export const createText = ({ x, y, text }) => {
  const element = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "text"
  );
  element.setAttribute("x", x);
  element.setAttribute("y", y);
  element.setAttribute("fill", "red");
  element.innerHTML = text;

  return element;
};
