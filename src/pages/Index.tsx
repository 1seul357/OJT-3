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
  removeSelect,
  removeGroupSelector,
} from "../utils/remove";
import ColorList from "../components/ColorList";
import { dragItem } from "../components/Drag";
import { clickGroup } from "../utils/clickGroup";
import { Select } from "../components/Select";
import { dataType } from "../utils/interface";

class SVGController {
  draw: Svg;
  group: Container;
  g: Container;
  index: number;
  props: any;

  constructor(
    element: SVGSVGElement,
    public setGroup: Function,
    public setShape: Function
  ) {
    this.draw = SVG(element).size(1200, 750).addClass("svg");
    this.group = this.draw.group();
    this.g = this.draw.group();
    this.index = Number(localStorage.getItem("index"));
    this.props = [
      this.draw,
      this.setGroup,
      this.setShape,
      this.multipleSelection,
      this.index,
    ];
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
  insertRect(type: string, element?: dataType) {
    if (element === undefined) {
      this.index += 1;
      this.props[4] = this.index;
      localStorage.setItem("index", String(this.index));
    }
    if (type === "rect") {
      return new Rectangle(this.props, element);
    }
    if (type === "circle") {
      return new Circle(this.props, element);
    }
    if (type === "polygon") {
      return new Polygon(this.props, element);
    }
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

  const handleClick = (type: string, element?: dataType) => {
    controller.current?.insertRect(type, element);
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
    for (let index = 1; index < 30; index++) {
      const element = JSON.parse(localStorage.getItem(String(index)) || "{}");
      if (element.type === "rect") {
        handleClick("rect", element);
      } else if (element.type === "circle") {
        handleClick("circle", element);
      } else if (element.type === "polygon") {
        handleClick("polygon", element);
      }
    }
  }, []);

  return (
    <div className="container">
      <Button
        color="secondary"
        variant="outlined"
        size="large"
        onClick={() => handleClick("rect")}>
        Rectangle
      </Button>
      <Button
        variant="outlined"
        size="large"
        onClick={() => handleClick("circle")}>
        Circle
      </Button>
      <Button
        color="error"
        variant="outlined"
        size="large"
        onClick={() => handleClick("polygon")}>
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
