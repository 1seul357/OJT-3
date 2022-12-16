import { clickItem } from "../utils/clickItem";
import { colorData } from "../utils/data";
import remove from "../utils/remove";
import { dataType } from "../utils/interface";
import { Svg } from "@svgdotjs/svg.js";

export default class Polygon {
  polygon;
  constructor(
    public draw: Svg,
    public setGroup: Function,
    public setShape: Function,
    public multipleSelection: Function,
    public element?: dataType
  ) {
    this.polygon = draw.polygon();
    this.render();
  }
  render() {
    const draw = this.draw;
    const setGroup = this.setGroup;
    const setShape = this.setShape;
    const multipleSelection = this.multipleSelection;
    const random = Math.floor(Math.random() * colorData.length);
    const x = Math.random() * 1000 + 50;
    const y = Math.random() * 400 + 50;
    const element = this.element;

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
        .addClass("item")
        .matrix(element.transform)
        .attr({ fill: element.fill });
      this.return();
    } else {
      this.polygon
        .plot(point)
        .addClass("item")
        .attr({ fill: colorData[random] });
    }
    this.polygon.click((e: MouseEvent) => {
      remove.removeGroupSelector(draw);
      if (e.shiftKey) {
        multipleSelection(this.polygon);
        return;
      }
      if (document.querySelector(".grouping")) {
        setGroup(false);
      }
      clickItem(this.polygon, draw, multipleSelection, setShape, setGroup);
    });
  }
  return() {
    return this.polygon;
  }
}
