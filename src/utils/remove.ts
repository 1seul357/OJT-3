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

export const removeGroup = () => {
  const group = document.querySelector(".group");
  group?.childNodes.forEach((node) =>
    document.querySelector(".svg")?.appendChild(node)
  );
  if (group?.childNodes.length != 0) {
    removeGroup();
  }
};

export const removeGroupSelector = (draw: Svg) => {
  draw.findOne(".gselect")?.attr({ fill: "none", stroke: "none" });
  draw.findOne(".gclone")?.attr({ fill: "transparent", stroke: "none" });
  if (
    document.querySelector(".group") &&
    document.querySelector(".grouping") === null
  ) {
    removeGroup();
  }
};
