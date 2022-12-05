import { Svg, SVG } from "@svgdotjs/svg.js";
import { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import Rectangle from "../components/Rectangle";
import Circle from "../components/Circle";
import Polygon from "../components/Polygon";
import { removeSelector } from "../utils/removeSelector";
import ColorList from "../components/ColorList";

class SVGController {
  draw: Svg;
  constructor(element: SVGSVGElement) {
    this.draw = SVG(element).size(1200, 600).addClass("svg");
    this.render();
  }
  insertRect(setShape: any) {
    return new Rectangle(this.draw, setShape);
  }
  insertCircle(setShape: any) {
    return new Circle(this.draw, setShape);
  }
  insertPolygon(setShape: any) {
    return new Polygon(this.draw, setShape);
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
    });
  }
}

const Index = () => {
  const svgElement = useRef<SVGSVGElement>(null); // Svg
  const controller = useRef<SVGController>(); // draw
  const [shape, setShape] = useState<any>();

  const handleRectClick = () => {
    const result = controller.current?.insertRect(setShape);
    setShape(result);
  };
  const handlePolygonClick = () => {
    const result = controller.current?.insertPolygon(setShape);
    setShape(result);
  };
  const handleCircleClick = () => {
    const result = controller.current?.insertCircle(setShape);
    setShape(result);
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
      <svg ref={svgElement}></svg>
      <ColorList result={shape} />
    </div>
  );
};

export default Index;
