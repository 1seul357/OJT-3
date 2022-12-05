import { Svg, SVG } from "@svgdotjs/svg.js";
import { useEffect, useRef } from "react";
import Button from "@mui/material/Button";
import Rectangle from "../components/Rectangle";
import Circle from "../components/Circle";
import Polygon from "../components/Polygon";

class SVGController {
  draw: Svg;
  constructor(element: SVGSVGElement) {
    this.draw = SVG(element).size(1200, 600).addClass("svg");
  }
  insertRect() {
    new Rectangle(this.draw);
  }
  insertCircle() {
    new Circle(this.draw);
  }
  insertPolygon() {
    new Polygon(this.draw);
  }
}

const Index = () => {
  const svgElement = useRef<SVGSVGElement>(null); // Svg
  const controller = useRef<SVGController>(); // draw
  const handleRectClick = () => controller.current?.insertRect();
  const handlePolygonClick = () => controller.current?.insertPolygon();
  const handleCircleClick = () => controller.current?.insertCircle();

  useEffect(() => {
    controller.current = new SVGController(svgElement.current!);
  }, []);

  return (
    <div>
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
    </div>
  );
};

export default Index;
