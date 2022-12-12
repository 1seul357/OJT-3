import { clickItem } from "../utils/clickItem";
import { colorData } from "../utils/data";
import { removeGroupSelector } from "../utils/remove";
import { dataType } from "../utils/interface";
import LocalStorage from "../utils/localStorage";

export default class Polygon {
  constructor(public props: any, public element?: dataType) {
    this.render();
  }
  render() {
    const [draw, setGroup, setShape, multipleSelection, index] = this.props;
    const random = Math.floor(Math.random() * colorData.length);
    const x = Math.random() * 1000 + 50;
    const y = Math.random() * 400 + 50;
    const element = this.element;
    let polygon = draw.polygon();
    const point =
      x +
      "," +
      (y - 75) +
      " " +
      (x + 75) +
      "," +
      (y + 75) +
      " " +
      (x - 75) +
      "," +
      (y + 75);

    if (element) {
      polygon
        .plot(element.point)
        .setData(element.index)
        .attr({ fill: element.fill });
    } else {
      polygon.plot(point).setData(index).attr({ fill: colorData[random] });
      LocalStorage.setItem(index, polygon);
    }
    polygon.click((e: MouseEvent) => {
      removeGroupSelector(draw);
      if (e.shiftKey) {
        multipleSelection(polygon);
        return;
      }
      if (document.querySelector(".grouping")) {
        setGroup(null);
      }
      clickItem(polygon, draw, multipleSelection, setShape, setGroup);
    });
  }
}
