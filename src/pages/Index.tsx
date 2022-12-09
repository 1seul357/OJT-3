import { Container, Svg, SVG } from "@svgdotjs/svg.js";
import "@svgdotjs/svg.draggable.js";
import { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import Rectangle from "../components/Rectangle";
import Circle from "../components/Circle";
import Polygon from "../components/Polygon";
import {
  removeSelector,
  removeGroup,
  removeGrouping,
  removeSelect,
  removeGroupSelector,
} from "../utils/remove";
import ColorList from "../components/ColorList";
import { dragItem } from "../utils/drag";
import { clickGroup } from "../utils/clickGroup";
import { Select } from "../components/Select";

class SVGController {
  draw: Svg;
  group: Container;
  gg: Container;
  constructor(element: SVGSVGElement, public setGroup: Function) {
    this.draw = SVG(element).size(1200, 750).addClass("svg");
    this.group = this.draw.group();
    this.gg = this.draw.group();
    this.render(setGroup);
  }
  multipleSelection = (item: Svg) => {
    removeSelector();
    this.setGroup(false);
    this.group.add(item).addClass("group");
    const select = Select(this.draw, this.group, "select");
    this.group.add(select);
    dragItem(this.group);
  };
  makeGrouping = (setGroup: Function) => {
    this.gg = this.group;
    if (document.querySelectorAll(".select").length >= 2) {
      this.group = this.draw.group();
      setGroup(true);
      document.querySelectorAll(".select").forEach((node) => node.remove());
      const select = Select(this.draw, this.gg, "gselect");
      this.gg.add(select).addClass("grouping");
      clickGroup(this.gg, this.draw, select, setGroup, this.clickItem);
    }
  };
  makeUnGrouping = (setGroup: Function) => {
    this.gg.children().forEach((el) => {
      el.transform(el.matrix().multiply(this.gg.matrix()));
    });
    this.gg.removeClass("grouping");
    // this.group.transform({ rotate: 0 });
    removeSelector();
    removeGroup(this.draw, this.gg);
    setGroup(false);
  };
  clickItem = (item: Container) => {
    this.gg = item;
  };
  insertRect(setShape: Function, setGroup: Function) {
    return new Rectangle(this.draw, setShape, setGroup, this.multipleSelection);
  }
  insertCircle(setShape: Function, setGroup: Function) {
    return new Circle(this.draw, setShape, setGroup, this.multipleSelection);
  }
  insertPolygon(setShape: Function, setGroup: Function) {
    return new Polygon(this.draw, setShape, setGroup, this.multipleSelection);
  }
  render(setGroup: Function) {
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
        setGroup(null);
      }
    });
  }
}

const Index = () => {
  const svgElement = useRef<SVGSVGElement>(null); // Svg
  const controller = useRef<SVGController>(); // draw
  const [shape, setShape] = useState<Object>();
  const [group, setGroup] = useState<any>(false);

  const handleRectClick = () => {
    controller.current?.insertRect(setShape, setGroup);
  };
  const handlePolygonClick = () => {
    controller.current?.insertPolygon(setShape, setGroup);
  };
  const handleCircleClick = () => {
    controller.current?.insertCircle(setShape, setGroup);
  };
  const makeGroup = () => {
    controller.current?.makeGrouping(setGroup);
  };
  const makeUnGroup = () => {
    controller.current?.makeUnGrouping(setGroup);
  };

  useEffect(() => {
    controller.current = new SVGController(svgElement.current!, setGroup);
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
