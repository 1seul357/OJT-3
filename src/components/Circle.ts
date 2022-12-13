import { clickItem } from "../utils/clickItem";
import { colorData } from "../utils/data";
import remove from "../utils/remove";
import { dataType } from "../utils/interface";
import LocalStorage from "../utils/localStorage";

export default class Circle {
  constructor(public props: any, public element?: dataType) {
    this.render();
  }
  render() {
    const [draw, setGroup, setShape, multipleSelection, index] = this.props;
    const random = Math.floor(Math.random() * colorData.length);
    const element = this.element;
    let circle = draw.circle();

    if (element) {
      circle
        .width(element.width)
        .x(element.x)
        .y(element.y)
        .setData(element.index)
        .transform(element.transform)
        .attr({ fill: element.fill });
    } else {
      circle
        .width(150)
        .x(Math.random() * 1000 + 50)
        .y(Math.random() * 400 + 50)
        .setData(index)
        .transform(0)
        .attr({ fill: colorData[random] });
      LocalStorage.setItem(index, circle);
    }

    circle.click((e: MouseEvent) => {
      remove.removeGroupSelector(draw);
      if (e.shiftKey) {
        multipleSelection(circle);
        return;
      }
      if (document.querySelector(".grouping")) {
        setGroup(null);
      }
      clickItem(circle, draw, multipleSelection, setShape, setGroup);
    });
  }
}
