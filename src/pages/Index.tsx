import { Container, Svg, SVG } from "@svgdotjs/svg.js";
import "@svgdotjs/svg.draggable.js";
import { Children, useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import Rectangle from "../components/Rectangle";
import Circle from "../components/Circle";
import Polygon from "../components/Polygon";
import remove from "../utils/remove";
import ColorList from "../components/ColorList";
import { dragItem } from "../components/Drag";
import { clickGroup } from "../utils/clickGroup";
import { Select } from "../components/Select";
import { dataType } from "../utils/interface";
import LocalStorage from "../utils/localStorage";

class SVGController {
  draw: Svg;
  group: Container;
  g: Container;
  index;
  props;

  constructor(
    element: SVGSVGElement,
    public setGroup: Function,
    public setShape: Function
  ) {
    this.draw = SVG(element).size(1200, 750).addClass("svg");
    this.group = this.draw.group();
    this.g = this.draw.group();
    this.index = Number(LocalStorage.getItem("index"));
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
    remove.removeSelector();
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
      this.index += 1;
      this.g.add(select).addClass("grouping").setData(this.index);
      this.g.children().forEach((element) => {
        element.removeClass("item");
      });
      clickGroup(this.g, this.draw, select, this.setGroup, this.clickItem);
    }
  };
  makeUnGrouping = () => {
    this.g.children().forEach((el) => {
      el.matrix(this.g.matrix().multiply(el.matrix()));
    });
    remove.removeGroup(this.draw, this.g);
    this.setGroup(false);
  };
  onSave = () => {
    const items = this.draw.find(".item");
    const groups = this.draw.find(".grouping");
    const array: any = [];
    const arr: any = [];

    groups.forEach((el) => {
      el.children().forEach((element: any) => {
        if (typeof element.dom != "number") return;
        arr.push(
          element.type === "rect"
            ? {
                type: "rect",
                index: element.dom,
                width: element.width(),
                height: element.height(),
                x: element.x(),
                y: element.y(),
                transform: element.transform(),
                fill: element.fill(),
              }
            : element.type === "circle"
            ? {
                type: "circle",
                index: element.dom,
                width: element.width(),
                x: element.x(),
                y: element.y(),
                transform: element.transform(),
                fill: element.fill(),
              }
            : {
                type: "polygon",
                index: element.dom,
                point: element.plot(),
                transform: element.transform(),
                fill: element.fill(),
              }
        );
      });
      array.push({
        type: "g",
        index: this.index,
        children: arr,
      });
    });
    items.forEach((element: any) => {
      if (typeof element.dom != "number") return;
      array.push(
        element.type === "rect"
          ? {
              type: "rect",
              index: element.dom,
              width: element.width(),
              height: element.height(),
              x: element.x(),
              y: element.y(),
              transform: element.transform(),
              fill: element.fill(),
            }
          : element.type === "circle"
          ? {
              type: "circle",
              index: element.dom,
              width: element.width(),
              x: element.x(),
              y: element.y(),
              transform: element.transform(),
              fill: element.fill(),
            }
          : {
              type: "polygon",
              index: element.dom,
              point: element.plot(),
              transform: element.transform(),
              fill: element.fill(),
            }
      );
    });
    LocalStorage.setItem("items", array);
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
      const item = new Rectangle(this.props, element);
      return item.return();
    }
    if (type === "circle") {
      const item = new Circle(this.props, element);
      return item.return();
    }
    if (type === "polygon") {
      const item = new Polygon(this.props, element);
      return item.return();
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
      remove.removeSelect(this.draw);
      remove.removeGroupSelector(this.draw);

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
    return controller.current?.insertRect(type, element);
  };
  const makeGroup = () => {
    controller.current?.makeGrouping();
  };
  const makeUnGroup = () => {
    controller.current?.makeUnGrouping();
  };
  const multipleSelection = (element: Svg) => {
    controller.current?.multipleSelection(element);
  };
  const makeGrouping = () => {
    controller.current?.makeGrouping();
  };
  const onSave = () => {
    controller.current?.onSave();
  };

  useEffect(() => {
    controller.current = new SVGController(
      svgElement.current!,
      setGroup,
      setShape
    );
    if (localStorage.length === 1) {
      localStorage.setItem("index", String(0));
    }
    const items = JSON.parse(LocalStorage.getItem("items") || "{}");
    for (let index = 0; index < items?.length; index++) {
      const item = items[index];
      if (item.type === "g") {
        item.children.forEach((el: any) => {
          const item = handleClick(el.type, el);
          multipleSelection(item);
        });
        makeGrouping();
      } else {
        handleClick(item.type, item);
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
      <Button color="warning" variant="outlined" size="large" onClick={onSave}>
        SAVE
      </Button>
      <svg ref={svgElement}></svg>
      <ColorList item={shape} />
    </div>
  );
};

export default Index;
