import { Svg } from "@svgdotjs/svg.js";
import { colorData } from "../utils/data";

export default class Rectangle {
  constructor(public draw: Svg, public setShape: Function) {
    this.render();
  }
  render() {
    const draw = this.draw;
    const random = Math.floor(Math.random() * colorData.length);
    const setShape = this.setShape;

    const rect = draw
      .rect(150, 150)
      .x(Math.random() * 1000 + 0)
      .y(Math.random() * 400 + 0)
      .attr({ fill: colorData[random] });

    rect.click(() => {
      setShape(rect);
    });
  }
}
