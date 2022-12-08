import { Svg } from "@svgdotjs/svg.js";
import { clickItem } from "../utils/clickItem";
import { colorData } from "../utils/data";

export default class Circle {
  constructor(
    public draw: Svg,
    public setShape: Function,
    public multipleSelection: Function
  ) {
    this.render();
  }
  render() {
    const draw = this.draw;
    const random = Math.floor(Math.random() * colorData.length);
    const setShape = this.setShape;
    const multipleSelection = this.multipleSelection;

    const circle = draw
      .circle(150)
      .x(Math.random() * 1000 + 50)
      .y(Math.random() * 400 + 50)
      .attr({ fill: colorData[random] });

    circle.click((e: MouseEvent) => {
      if (e.shiftKey) {
        multipleSelection(circle);
        return;
      }
      clickItem(circle, draw, multipleSelection, setShape);
    });
  }
}
