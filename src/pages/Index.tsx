import { Container, Svg, SVG } from "@svgdotjs/svg.js";
import "@svgdotjs/svg.draggable.js";
import { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import Rectangle from "../components/Rectangle";
import Circle from "../components/Circle";
import Polygon from "../components/Polygon";
import { removeSelector } from "../utils/removeSelector";
import { removeGroup } from "../utils/removeGroup";
import { removeGrouping } from "../utils/removeGrouping";
import ColorList from "../components/ColorList";
import { dragItem } from "../utils/drag";
import { clickGroup } from "../utils/clickGroup";
import { Select } from "../components/Select";

class SVGController {
  draw: Svg;
  group: Container;
  constructor(element: SVGSVGElement) {
    this.draw = SVG(element).size(1200, 750).addClass("svg");
    this.group = this.draw.group();
    this.render();
  }
  multipleSelection = (item: Svg) => {
    removeSelector();
    this.group.add(item).addClass("group");
    const select = Select(this.draw, this.group, "select");
    this.group.add(select);
  };
  makeGrouping = (setGroup: Function) => {
    if (document.querySelectorAll(".select").length >= 2) {
      setGroup(true);
      this.group.addClass("grouping");
      document.querySelectorAll(".select").forEach((node) => node.remove());
      const select = Select(this.draw, this.group, "gselect");
      this.group.add(select);
      clickGroup(this.group, this.draw, select, setGroup);
    }
  };
  makeUnGrouping = (setGroup: Function) => {
    removeGrouping();
    this.group.children().forEach((el) => {
      el.transform(el.matrix().multiply(this.group.matrix()));
    });
    this.group.removeClass("grouping");
    // this.group.transform({ rotate: 0 });
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

      this.draw.find(".g").forEach((node) => {
        if (node.node.childNodes.length === 0) {
          node.remove();
        }
      });

      const gselect = this.group.findOne(".gselect");
      gselect?.attr({ fill: "none", stroke: "none" });
      const gclone = document.querySelector(".gclone");
      const clone = SVG(gclone);
      if (clone) {
        clone.attr({ fill: "transparent", stroke: "none" });
      }
      if (
        document.querySelector(".group") &&
        document.querySelector(".grouping") === null
      ) {
        removeGroup();
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
