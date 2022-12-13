import { clickItem } from "../utils/clickItem";
import { colorData } from "../utils/data";
import remove from "../utils/remove";
import { dataType } from "../utils/interface";

export default class Rectangle {
  rect;
  constructor(public props: any, public element?: dataType) {
    this.render();
  }
  render() {
    const [draw, setGroup, setShape, multipleSelection, index] = this.props;
    const random = Math.floor(Math.random() * colorData.length);
    const element = this.element;
    this.rect = draw.rect();

    if (element) {
      this.rect
        .width(element.width)
        .height(element.height)
        .x(element.x)
        .y(element.y)
        .setData(element.index)
        .addClass("item")
        .transform(element.transform)
        .attr({ fill: element.fill });
      this.return();
    } else {
      this.rect
        .width(150)
        .height(150)
        .x(Math.random() * 1000 + 50)
        .y(Math.random() * 400 + 50)
        .setData(index)
        .addClass("item")
        .transform(0)
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
