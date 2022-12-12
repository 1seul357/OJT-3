import { clickItem } from "../utils/clickItem";
import { colorData } from "../utils/data";
import { removeGroupSelector } from "../utils/remove";
import { dataType } from "../utils/interface";

export default class Rectangle {
  constructor(public props: any, public element?: dataType) {
    this.render();
  }
  render() {
    const [draw, setShape, setGroup, multipleSelection, index] = this.props;
    const random = Math.floor(Math.random() * colorData.length);
    const element = this.element;
    let rect = draw.rect();

    if (element) {
      rect
        .width(element.width)
        .height(element.height)
        .x(element.x)
        .y(element.y)
        .setData(element.index)
        .attr({ fill: element.fill });
    } else {
      rect
        .width(150)
        .height(150)
        .x(Math.random() * 1000 + 50)
        .y(Math.random() * 400 + 50)
        .setData(index)
        .attr({ fill: colorData[random] });
      localStorage.setItem(
        index,
        JSON.stringify({
          type: "rect",
          index: index,
          width: rect.width(),
          height: rect.height(),
          x: rect.x(),
          y: rect.y(),
          fill: rect.fill(),
        })
      );
    }

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
