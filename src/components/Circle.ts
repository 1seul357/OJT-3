import { clickItem } from "../utils/clickItem";
import { colorData } from "../utils/data";
import { removeGroupSelector } from "../utils/remove";
import { dataType } from "../utils/interface";

export default class Circle {
  constructor(public props: any, public element?: dataType) {
    this.render();
  }
  render() {
    const [draw, setShape, setGroup, multipleSelection, index] = this.props;
    const random = Math.floor(Math.random() * colorData.length);
    const element = this.element;
    let circle = draw.circle();

    if (element) {
      circle
        .width(element.width)
        .x(element.x)
        .y(element.y)
        .setData(element.index)
        .attr({ fill: element.fill });
    } else {
      circle
        .width(150)
        .x(Math.random() * 1000 + 50)
        .y(Math.random() * 400 + 50)
        .setData(index)
        .attr({ fill: colorData[random] });
      localStorage.setItem(
        index,
        JSON.stringify({
          type: "circle",
          index: index,
          width: circle.width(),
          x: circle.x(),
          y: circle.y(),
          fill: circle.fill(),
        })
      );
    }

    circle.click((e: MouseEvent) => {
      removeGroupSelector(draw);
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
