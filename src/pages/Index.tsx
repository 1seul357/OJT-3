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
  // 그룹화 버튼 없이 만드는 그룹화 (하얀 배경 더블 클릭하면 사라지는 그룹화)
  multipleSelection = (item: Svg) => {
    removeSelector();
    this.group.add(item).addClass("group");
    const select = Select(this.draw, this.group, "select");
    this.group.add(select);
  };
  // 그룹화 버튼 클릭으로 만드는 그룹화 (하얀 배경 더블 클릭하면 그룹화 사라지지 않음)
  makeGrouping = (setGroup: Function) => {
    if (document.querySelectorAll(".select").length >= 2) {
      setGroup(true);
      this.group.addClass("grouping");
      document.querySelectorAll(".select").forEach((node) => node.remove());
      // 그룹화되는 CSS
      const select = Select(this.draw, this.group, "gselect");
      this.group.add(select);
      clickGroup(this.group, this.draw, select, setGroup);
    }
  };
  // 그룹화 해제 버튼으로 그룹화 해제
  makeUnGrouping = (setGroup: Function) => {
    removeGrouping();
    // 그룹화 해제되면 모든 도형들 회전 적용
    this.group.node.childNodes.forEach((nodes) => {
      const node = SVG(nodes);
      node.node.childNodes.forEach((n) => {
        SVG(n).transform(this.group.transform());
      });
    });
    this.group.removeClass("grouping");
    this.group.transform({ rotate: 0 });
    removeSelector();
    removeGroup();
    setGroup(false);
  };
  // 사각형 만드는 함수
  insertRect(setShape: Function) {
    return new Rectangle(this.draw, setShape, this.multipleSelection);
  }
  // 원 만드는 함수
  insertCircle(setShape: Function) {
    return new Circle(this.draw, setShape, this.multipleSelection);
  }
  // 삼각형 만드는 함수
  insertPolygon(setShape: Function) {
    return new Polygon(this.draw, setShape, this.multipleSelection);
  }
  render() {
    const svg = document.querySelector("svg");

    // svg 영역 더블 클릭하면 모든 점이나 그룹화 사라짐
    svg?.addEventListener("dblclick", (e) => {
      if (
        e.target instanceof SVGRectElement ||
        e.target instanceof SVGCircleElement ||
        e.target instanceof SVGPolygonElement
      )
        return;
      removeSelector();
      document.querySelectorAll(".select").forEach((node) => node.remove());
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

    // 그룹화 버튼으로 만들지 않는 그룹화, 드래그로 좌표 이동
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
