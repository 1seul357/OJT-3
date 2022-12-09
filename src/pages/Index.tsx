import { Container, Shape, Svg, SVG } from "@svgdotjs/svg.js";
import "@svgdotjs/svg.draggable.js";
import { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import Rectangle from "../components/Rectangle";
import Circle from "../components/Circle";
import Polygon from "../components/Polygon";
import {
  removeSelector,
  removeGroup,
  removeSelect,
  removeGroupSelector,
} from "../utils/remove";
import ColorList from "../components/ColorList";
import { dragItem } from "../components/Drag";
import { clickGroup } from "../utils/clickGroup";
import { Select } from "../components/Select";
// [
//   {
//     type: "group",
//     transform: "matrix(1,0,0,1,150,150)",
//     children: [{ type: "rect", x: 10, y: 10 }],
//   },
// ];
class SVGController {
  draw: Svg;
  group: Container;
  g: Container;
  constructor(
    element: SVGSVGElement,
    public setGroup: Function,
    public setShape: Function
  ) {
    this.draw = SVG(element).size(1200, 750).addClass("svg");
    this.group = this.draw.group();
    this.g = this.draw.group();
    this.render();
  }
  multipleSelection = (item: Svg) => {
    removeSelector();
    this.setGroup(false);
    this.group.add(item).addClass("group");
    const select = Select(this.draw, this.group, "select");
    this.group.add(select);
    dragItem(this.draw, this.group);
  };
  makeGrouping = () => {
    this.g = this.group;
    if (document.querySelectorAll(".select").length >= 2) {
      this.group = this.draw.group();
      this.setGroup(true);
      document.querySelectorAll(".select").forEach((node) => node.remove());
      const select = Select(this.draw, this.g, "gselect");
      this.g.add(select).addClass("grouping");
      clickGroup(this.g, this.draw, select, this.setGroup, this.clickItem);
    }
  };
  makeUnGrouping = () => {
    this.g.children().forEach((el) => {
      el.matrix(this.g.matrix().multiply(el.matrix()));
    });
    removeGroup(this.draw, this.g);
    this.setGroup(false);
  };
  clickItem = (item: Container) => {
    this.g = item;
  };
  insertRect() {
    return new Rectangle(
      this.draw,
      this.setShape,
      this.setGroup,
      this.multipleSelection
    );
  }
  insertCircle() {
    return new Circle(
      this.draw,
      this.setShape,
      this.setGroup,
      this.multipleSelection
    );
  }
  insertPolygon() {
    return new Polygon(
      this.draw,
      this.setShape,
      this.setGroup,
      this.multipleSelection
    );
  }
  render() {
    const svg = document.querySelector("svg");
    svg?.addEventListener("dblclick", (e) => {
      if (
        e.target instanceof SVGRectElement ||
        e.target instanceof SVGCircleElement ||
        e.target instanceof SVGPolygonElement
      )
        return;
      removeSelect(this.draw);
      removeGroupSelector(this.draw);

      if (document.querySelector(".gselect")) {
        this.setGroup(null);
      }
    });
  }
}

const Index = () => {
  const svgElement = useRef<SVGSVGElement>(null); // Svg
  const controller = useRef<SVGController>(); // draw
  const [shape, setShape] = useState<Object>();
  const [group, setGroup] = useState<boolean | null>(false);

  const handleRectClick = () => {
    controller.current?.insertRect();
  };
  const handlePolygonClick = () => {
    controller.current?.insertPolygon();
  };
  const handleCircleClick = () => {
    controller.current?.insertCircle();
  };
  const makeGroup = () => {
    controller.current?.makeGrouping();
  };
  const makeUnGroup = () => {
    controller.current?.makeUnGrouping();
  };

  useEffect(() => {
    controller.current = new SVGController(
      svgElement.current!,
      setGroup,
      setShape
    );
  }, []);

  return (
    <div className="container">
      <Button
        color="secondary"
        variant="outlined"
        size="large"
        onClick={handleRectClick}>
        Rectangle
      </Button>
      <Button variant="outlined" size="large" onClick={handleCircleClick}>
        Circle
      </Button>
      <Button
        color="error"
        variant="outlined"
        size="large"
        onClick={handlePolygonClick}>
        Polygon
      </Button>
      {group === false ? (
        <Button
          color="success"
          variant="outlined"
          size="large"
          onClick={makeGroup}>
          GROUP
        </Button>
      ) : group === true ? (
        <Button
          color="success"
          variant="outlined"
          size="large"
          onClick={makeUnGroup}>
          UNGROUP
        </Button>
      ) : null}
      <svg ref={svgElement}></svg>
      <ColorList item={shape} />
    </div>
  );
};

export default Index;
