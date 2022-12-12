import { clickItem } from "../utils/clickItem";
import { colorData } from "../utils/data";
import { removeGroupSelector } from "../utils/remove";
import { dataType } from "../utils/interface";

export default class Polygon {
  constructor(public props: any, public element?: dataType) {
    this.render();
  }
  render() {
    const [draw, setShape, setGroup, multipleSelection, index] = this.props;
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
      console.log(polygon.node.attributes.points.nodeValue);
      localStorage.setItem(
        index,
        JSON.stringify({
          type: "polygon",
          index: index,
          point: polygon.node.attributes.points.nodeValue,
          fill: polygon.fill(),
        })
      );
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
