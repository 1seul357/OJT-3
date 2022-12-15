import { Container, Shape, Svg, SVG } from "@svgdotjs/svg.js";
import "@svgdotjs/svg.draggable.js";
import { useEffect, useRef, useState } from "react";
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
import { value } from "../utils/value";
import Modal from "../components/Modal";
import { indexDB } from "../utils/indexDB";

class SVGController {
  draw: Svg;
  group: Container;
  g: Container;

  constructor(
    element: SVGSVGElement,
    public setGroup: Function,
    public setShape: Function
  ) {
    this.draw = SVG(element).addClass("svg");
    this.draw.viewbox(0, 0, 1200, 750);
    this.group = this.draw.group();
    this.g = this.draw.group();
    this.render();
  }
  multipleSelection = (item: Shape) => {
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
      this.g.add(select).addClass("grouping");
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
    const array: any[] = [];
    const items = this.draw.find(".item");
    const groups = this.draw.find(".grouping");

    groups.forEach((el) => {
      const arr: dataType[] = [];
      el.children().forEach((element) => {
        const matrix = el.matrix().multiply(element.matrix());
        if (element.hasClass("gclone") || element.hasClass("gselect")) return;
        arr.push(value(element, matrix));
      });
      array.push({
        type: "g",
        children: arr,
      });
    });
    items.forEach((element) => {
      if (element.hasClass("clone")) return;
      array.push(value(element));
    });
    indexDB("items", array);
  };
  clickItem = (item: Container) => {
    this.g = item;
  };
  insertRect(type: string, element?: dataType) {
    if (type === "rect") {
      const item = new Rectangle(
        this.draw,
        this.setGroup,
        this.setShape,
        this.multipleSelection,
        element
      );
      return item.return();
    }
    if (type === "circle") {
      const item = new Circle(
        this.draw,
        this.setGroup,
        this.setShape,
        this.multipleSelection,
        element
      );
      return item.return();
    }
    if (type === "polygon") {
      const item = new Polygon(
        this.draw,
        this.setGroup,
        this.setShape,
        this.multipleSelection,
        element
      );
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
  const [name, setName] = useState<boolean>(true);

  const handleClick = (type: string, element?: dataType) => {
    return controller.current?.insertRect(type, element);
  };
  const makeGroup = () => {
    controller.current?.makeGrouping();
  };
  const makeUnGroup = () => {
    controller.current?.makeUnGrouping();
  };
  const multipleSelection = (element: Shape) => {
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

    let db;
    const request = window.indexedDB.open("IndexDB");
    request.onupgradeneeded = (e: any) => {
      db = e.target.result;
      db.createObjectStore("name", { keyPath: "id" });
    };
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction("name");
      const objStore = transaction.objectStore("name");
      const objStoreRequest = objStore.get("name");
      objStoreRequest.onsuccess = () => {
        if (objStoreRequest.result === undefined) {
          setName(false);
        }
        const objStoreRequestItem = objStore.get(objStoreRequest.result.value);
        objStoreRequestItem.onsuccess = () => {
          for (
            let index = 0;
            index < objStoreRequestItem.result.value?.length;
            index++
          ) {
            const item = objStoreRequestItem.result.value[index];
            if (item.type === "g") {
              item.children.forEach((el) => {
                const item = handleClick(el.type, el);
                if (item instanceof Shape) {
                  multipleSelection(item);
                }
              });
              makeGrouping();
            } else {
              handleClick(item.type, item);
            }
          }
        };
      };
    };
  }, []);

  return (
    <div className="container">
      {name ? null : <Modal setName={setName} />}
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
        Triangle
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
