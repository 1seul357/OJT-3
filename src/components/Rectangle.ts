import { Svg } from "@svgdotjs/svg.js";
import { clickItem } from "../utils/clickItem";
import { colorData } from "../utils/data";
import { removeGroupSelector } from "../utils/remove";

export default class Rectangle {
  constructor(
    public draw: Svg,
    public setShape: Function,
    public setGroup: Function,
    public multipleSelection: Function
  ) {
    this.render();
  }
  render() {
    const draw = this.draw;
    const random = Math.floor(Math.random() * colorData.length);
    const setShape = this.setShape;
    const setGroup = this.setGroup;
    const multipleSelection = this.multipleSelection;

    const rect = draw
      .rect(150, 150)
      .x(Math.random() * 1000 + 50)
      .y(Math.random() * 400 + 50)
      .attr({ fill: colorData[random] });

    rect.click((e: MouseEvent) => {
      removeGroupSelector(draw);
      if (e.shiftKey) {
        multipleSelection(rect);
        return;
      }
      if (document.querySelector(".grouping")) {
        setGroup(null);
      }
      clickItem(rect, draw, multipleSelection, setShape, setGroup);
    });
  }
}
