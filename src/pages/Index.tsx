import { Container, Svg, SVG } from "@svgdotjs/svg.js";
import "@svgdotjs/svg.draggable.js";
import { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import Rectangle from "../components/Rectangle";
import Circle from "../components/Circle";
import Polygon from "../components/Polygon";
import { removeSelector } from "../utils/removeSelector";
import { removeGroup } from "../utils/removeGroup";
import ColorList from "../components/ColorList";
import { dragItem } from "../utils/drag";

class SVGController {
  draw: Svg;
  group: Container;
  constructor(element: SVGSVGElement) {
    this.draw = SVG(element).size(1200, 600).addClass("svg");
    this.group = this.draw.group();
    this.render();
  }
  multipleSelection = (item: Svg) => {
    removeSelector();
    this.group.add(item).addClass("group");
    const box = this.group.bbox();
    const select = this.draw
      .rect(box.width, box.height)
      .x(box.x)
      .y(box.y)
      .addClass("select")
      .attr({ fill: "#ffffff66" })
      .stroke({ color: "#00000099" });
    this.group.add(select);
  };
  makeGrouping = (setGroup: Function) => {
    this.group.addClass("grouping");
    setGroup(true);
  };
  makeUnGrouping = (setGroup: Function) => {
    document.querySelectorAll(".select").forEach((node) => node.remove());
    this.group.removeClass("grouping");
    removeSelector();
    removeGroup();
    setGroup(false);
  };
  insertRect(setShape: Function) {
    return new Rectangle(this.draw, setShape, this.multipleSelection);
  }
  insertCircle(setShape: Function) {
    return new Circle(this.draw, setShape, this.multipleSelection);
  }
  insertPolygon(setShape: Function) {
    return new Polygon(this.draw, setShape, this.multipleSelection);
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
      removeSelector();
      document.querySelectorAll(".select").forEach((node) => node.remove());
      if (
        document.querySelector(".group") &&
        document.querySelector(".grouping") === null
      ) {
        removeGroup();
      }
    });

    this.group.mousedown(() => {
      if (document.querySelector(".grouping")) {
        const box = this.group.bbox();
        const select = this.draw
          .rect(box.width, box.height)
          .x(box.x)
          .y(box.y)
          .addClass("select")
          .attr({ fill: "#ffffff66" })
          .stroke({ color: "#00000099" });
        this.group.add(select);
      }
    });

    this.group.draggable().on("dragmove", ((e: CustomEvent) => {
      e.preventDefault();
      removeSelector();
      if (document.querySelector(".group")) {
        dragItem(e);
      }
    }) as EventListener);
  }
}

const Index = () => {
  const svgElement = useRef<SVGSVGElement>(null); // Svg
  const controller = useRef<SVGController>(); // draw
  const [shape, setShape] = useState<Object>();
  const [group, setGroup] = useState<Boolean>(false);

  const handleRectClick = () => {
    controller.current?.insertRect(setShape);
  };
  const handlePolygonClick = () => {
    controller.current?.insertPolygon(setShape);
  };
  const handleCircleClick = () => {
    controller.current?.insertCircle(setShape);
  };
  const makeGroup = () => {
    controller.current?.makeGrouping(setGroup);
  };
  const makeUnGroup = () => {
    controller.current?.makeUnGrouping(setGroup);
  };

  useEffect(() => {
    controller.current = new SVGController(svgElement.current!);
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
      ) : (
        <Button
          color="success"
          variant="outlined"
          size="large"
          onClick={makeUnGroup}>
          UNGROUP
        </Button>
      )}
      <svg ref={svgElement}></svg>
      <ColorList item={shape} />
    </div>
  );
};

export default Index;
