import { Svg, SVG } from "@svgdotjs/svg.js";
import { useEffect, useRef } from "react";
import Button from "@mui/material/Button";

class SVGController {
  draw: Svg;
  constructor(element: SVGSVGElement) {
    this.draw = SVG(element);
  }
  insertRect() {
    this.draw.rect(100, 100);
  }
}
const Index = () => {
  const svgElement = useRef<SVGSVGElement>(null); // Svg
  const controller = useRef<SVGController>(); // draw
  const handleRectClick = () => controller.current?.insertRect();

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
      <Button variant="outlined" size="large" onClick={handleRectClick}>
        Circle
      </Button>
      <Button
        color="error"
        variant="outlined"
        size="large"
        onClick={handleRectClick}>
        Polygon
      </Button>
      {/* <svg ref={svgElement}></svg> */}
    </div>
  );
};

export default Index;
