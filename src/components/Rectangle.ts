import { clickItem } from "../utils/clickItem";
import { colorData } from "../utils/data";
import remove from "../utils/remove";
import { dataType } from "../utils/interface";
import { Svg } from "@svgdotjs/svg.js";

export default class Rectangle {
  rect;
  constructor(
    public draw: Svg,
    public setGroup: Function,
    public setShape: Function,
    public multipleSelection: Function,
    public element?: dataType
  ) {
    this.rect = draw.rect();
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
      this.rect
        .width(element.width)
        .height(element.height)
        .x(element.x)
        .y(element.y)
        .addClass("item")
        .matrix(element.transform)
        .attr({ fill: element.fill });
      this.return();
    } else {
      this.rect
        .width(150)
        .height(150)
        .x(Math.random() * 1000 + 50)
        .y(Math.random() * 400 + 50)
        .addClass("item")
        .attr({ fill: colorData[random] });
    }

    this.rect.click((e: MouseEvent) => {
      remove.removeGroupSelector(draw);
      if (e.shiftKey) {
        multipleSelection(this.rect);
        return;
      }
      if (document.querySelector(".grouping")) {
        setGroup(null);
      }
      clickItem(this.rect, draw, multipleSelection, setShape, setGroup);
    });
  }
  return() {
    return this.rect;
  }
}
