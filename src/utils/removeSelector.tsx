export const removeSelector = () => {
  document.querySelector(".colorContainer")?.remove();
  document.querySelectorAll(".circles").forEach((node) => node.remove());
  document.querySelectorAll(".rotate").forEach((node) => node.remove());
};
