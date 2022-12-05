import { Svg } from "@svgdotjs/svg.js";
import { colorData } from "../utils/data";

export default class Polygon {
  constructor(public draw: Svg, public setShape: Function) {
    this.render();
  }
  render() {
    const draw = this.draw;
    const random = Math.floor(Math.random() * colorData.length);
    const x = Math.random() * 1000 + 0;
    const y = Math.random() * 400 + 0;
    const setShape = this.setShape;

    const point =
      x +
      "," +
      (y - 75) +
      " " +
      (x + 75) +
      "," +
      (y + 75) +
      " " +
      (x - 75) +
      "," +
      (y + 75);

    const polygon = draw.polygon(point).attr({ fill: colorData[random] });
    polygon.click(() => {
      setShape(polygon);
    });
  }
}
