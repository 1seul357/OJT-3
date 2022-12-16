import { clickItem } from "../utils/clickItem";
import { colorData } from "../utils/data";
import remove from "../utils/remove";
import { dataType } from "../utils/interface";
import { Svg } from "@svgdotjs/svg.js";

export default class Circle {
  circle;
  constructor(
    public draw: Svg,
    public setGroup: Function,
    public setShape: Function,
    public multipleSelection: Function,
    public element?: dataType
  ) {
    this.circle = draw.circle();
    this.render();
  }
  render() {
    const draw = this.draw;
    const setGroup = this.setGroup;
    const setShape = this.setShape;
    const multipleSelection = this.multipleSelection;
    const random = Math.floor(Math.random() * colorData.length);
    const element = this.element;

    if (element) {
      this.circle
        .width(element.width)
        .x(element.x)
        .y(element.y)
        .addClass("item")
        .matrix(element.transform)
        .attr({ fill: element.fill });
      this.return();
    } else {
      this.circle
        .width(150)
        .x(Math.random() * 1000 + 50)
        .y(Math.random() * 400 + 50)
        .addClass("item")
        .attr({ fill: colorData[random] });
    }

    this.circle.click((e: MouseEvent) => {
      remove.removeGroupSelector(draw);
      if (e.shiftKey) {
        multipleSelection(this.circle);
        return;
      }
      if (document.querySelector(".grouping")) {
        setGroup(false);
      }
      clickItem(this.circle, draw, multipleSelection, setShape, setGroup);
    });
  }
  return() {
    return this.circle;
  }
}
