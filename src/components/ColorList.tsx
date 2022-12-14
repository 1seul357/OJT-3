import { colorData } from "../utils/data";
import { Shape } from "@svgdotjs/svg.js";
import "../css/color.css";

const ColorList = (selectItem: any) => {
  const { item } = selectItem;
  const updateColor = (colorName: string) => {
    item.attr({ fill: colorName });
  };

  return (
    <div className="colorContainer">
      {colorData.map((colorName: string, i: number) => (
        <div
          key={i}
          className="color"
          style={{ backgroundColor: colorName }}
          onClick={() => updateColor(colorName)}></div>
      ))}
    </div>
  );
};

export default ColorList;
