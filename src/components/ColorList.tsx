import { colorData } from "../utils/data";
import "../css/color.css";

const ColorList = (result: any) => {
  const shape = result.result;
  const updateColor = (colorName: string) => {
    shape.attr({ fill: colorName });
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
