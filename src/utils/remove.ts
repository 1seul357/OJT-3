import { Container, Svg } from "@svgdotjs/svg.js";

export const removeGrouping = () => {
  document.querySelectorAll(".select").forEach((node) => node.remove());
  document.querySelector(".gclone")?.remove();
  document.querySelector(".gselect")?.remove();
};

export const removeSelector = () => {
  document.querySelectorAll(".circles").forEach((node) => node.remove());
  document.querySelectorAll(".rotate").forEach((node) => node.remove());
  document.querySelector(".clone")?.remove();
};

export const removeSelect = (draw: Svg) => {
  document.querySelectorAll(".select").forEach((node) => node.remove());
  document.querySelectorAll(".circles").forEach((node) => node.remove());
  document.querySelectorAll(".rotate").forEach((node) => node.remove());
  document.querySelector(".clone")?.remove();
};

export const removeG = (draw: Svg) => {
  draw.find(".g").forEach((node) => {
    if (node.node.childElementCount === 0) {
      node.remove();
    }
  });
};

export const removeGroup = (draw: Svg, gg: Container) => {
  gg.findOne(".gselect")?.remove();
  gg?.children().forEach((node) => {
    node.addTo(draw);
  });
  if (gg?.children().length != 0) {
    removeGroup(draw, gg);
  }
  gg.parent()?.remove();
  removeSelector();
};

export const removeGroupSelector = (draw: Svg) => {
  draw
    .find(".gselect")
    ?.forEach((node) => node.attr({ fill: "none", stroke: "none" }));
  draw
    .find(".gclone")
    ?.forEach((node) => node.attr({ fill: "transparent", stroke: "none" }));
  if (draw.find(".group") && draw.find(".grouping") === null) {
    // removeGroup(draw);
  }
};

export const removeItem = (g: Container, setGroup: Function) => {
  window.addEventListener("keyup", (e) => {
    if (e.key === "Delete") {
      if (g.node.childElementCount >= 4) {
        localStorage.removeItem(g.dom);
        g.remove();
        setGroup(false);
      }
    }
  });
};
