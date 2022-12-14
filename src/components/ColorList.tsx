import { colorData } from "../utils/data";
import { Svg } from "@svgdotjs/svg.js";
import "../css/color.css";

export interface itemType {
  item: undefined | Svg;
}
const ColorList = ({ item }: itemType) => {
  const updateColor = (colorName: string) => {
    item?.attr({ fill: colorName });
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
