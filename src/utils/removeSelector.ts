export const removeSelector = () => {
  document.querySelectorAll(".circles").forEach((node) => node.remove());
  document.querySelectorAll(".rotate").forEach((node) => node.remove());
};
