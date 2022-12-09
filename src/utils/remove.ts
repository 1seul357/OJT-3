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

  draw.find(".g").forEach((node) => {
    if (node.node.childNodes.length === 0) {
      node.remove();
    }
  });
};

export const removeShapeGroup = (group: Container, setGroup: Function) => {
  window.addEventListener("keyup", (e) => {
    if (e.key === "Delete") {
      setGroup(false);
      if (group.node.childElementCount >= 2) {
        while (group.node.childNodes.length >= 1) {
          group.node.childNodes.forEach((el: any) => el.remove());
          document.querySelector(".gclone")?.remove();
          document
            .querySelectorAll(".circles")
            .forEach((node) => node.remove());
          document.querySelector(".rotate")?.remove();
          group.removeClass("grouping");
          setGroup(false);
        }
      }
    }
  });
};

export const removeShape = (g: Container) => {
  window.addEventListener("keyup", (e) => {
    if (e.key === "Delete") {
      if (g.node.childElementCount >= 4) {
        g.remove();
      }
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
