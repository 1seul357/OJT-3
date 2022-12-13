import { clickItem } from "../utils/clickItem";
import { colorData } from "../utils/data";
import remove from "../utils/remove";
import { dataType } from "../utils/interface";
import LocalStorage from "../utils/localStorage";

export default class Rectangle {
  constructor(public props: any, public element?: dataType) {
    this.render();
  }
  render() {
    const [draw, setGroup, setShape, multipleSelection, index] = this.props;
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
        .transform(element.transform)
        .attr({ fill: element.fill });
    } else {
      rect
        .width(150)
        .height(150)
        .x(Math.random() * 1000 + 50)
        .y(Math.random() * 400 + 50)
        .setData(index)
        .transform(0)
        .attr({ fill: colorData[random] });
      LocalStorage.setItem(index, rect);
    }

    rect.click((e: MouseEvent) => {
      remove.removeGroupSelector(draw);
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
