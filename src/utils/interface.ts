import { Svg } from "@svgdotjs/svg.js";

export interface dataType {
  index: number;
  width: number;
  height: number;
  x: number;
  y: number;
  point?: string;
  transform?: any;
  fill: string;
}

export interface propsType {
  draw: Svg;
  setGroup: Function;
  setShape: Function;
  multipleSelection: Function;
  index: any;
}
