import { clickItem } from "../utils/clickItem";
import { colorData } from "../utils/data";
import remove from "../utils/remove";
import { dataType } from "../utils/interface";

export default class Polygon {
  polygon;
  constructor(public props: any, public element?: dataType) {
    this.render();
  }
  render() {
    const [draw, setGroup, setShape, multipleSelection, index] = this.props;
    const random = Math.floor(Math.random() * colorData.length);
    const x = Math.random() * 1000 + 50;
    const y = Math.random() * 400 + 50;
    const element = this.element;
    this.polygon = draw.polygon();
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
      this.polygon
        .plot(element.point)
        .setData(element.index)
        .addClass("item")
        .transform(element.transform)
        .attr({ fill: element.fill });
      this.return();
    } else {
      this.polygon
        .plot(point)
        .setData(index)
        .addClass("item")
        .transform(0)
        .attr({ fill: colorData[random] });
    }
    this.polygon.click((e: MouseEvent) => {
      remove.removeGroupSelector(draw);
      if (e.shiftKey) {
        multipleSelection(this.polygon);
        return;
      }
      if (document.querySelector(".grouping")) {
        setGroup(null);
      }
      clickItem(this.polygon, draw, multipleSelection, setShape, setGroup);
    });
  }
  return() {
    return this.polygon;
  }
}
