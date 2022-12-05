import { Shape } from "@svgdotjs/svg.js";
import { colorData } from "../utils/data";
import "react";
import "../css/color.css";

const ColorList = () => {
  const updateColor = () => {
    console.log("update");
  };

  return (
    <div className="colorContainer">
      {colorData.map((colorName: string, i: number) => (
        <div
          key={i}
          className="color"
          style={{ backgroundColor: colorName }}
          onClick={updateColor}></div>
      ))}
    </div>
  );
};

export default ColorList;
