import { clickItem } from "../utils/clickItem";
import { colorData } from "../utils/data";
import remove from "../utils/remove";
import { dataType } from "../utils/interface";

export default class Circle {
  circle;
  constructor(public props: any, public element?: dataType) {
    this.render();
  }
  render() {
    const [draw, setGroup, setShape, multipleSelection, index] = this.props;
    const random = Math.floor(Math.random() * colorData.length);
    const element = this.element;
    this.circle = draw.circle();

    if (element) {
      this.circle
        .width(element.width)
        .x(element.x)
        .y(element.y)
        .setData(element.index)
        .addClass("item")
        .transform(element.transform)
        .attr({ fill: element.fill });
      this.return();
    } else {
      this.circle
        .width(150)
        .x(Math.random() * 1000 + 50)
        .y(Math.random() * 400 + 50)
        .setData(index)
        .addClass("item")
        .transform(0)
        .attr({ fill: colorData[random] });
    }

    this.circle.click((e: MouseEvent) => {
      remove.removeGroupSelector(draw);
      if (e.shiftKey) {
        multipleSelection(this.circle);
        return;
      }
      if (document.querySelector(".grouping")) {
        setGroup(null);
      }
      clickItem(this.circle, draw, multipleSelection, setShape, setGroup);
    });
  }
  return() {
    return this.circle;
  }
}
