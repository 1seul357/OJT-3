export const removeGrouping = () => {
  document.querySelectorAll(".select").forEach((node) => node.remove());
  document.querySelector(".gclone")?.remove();
  document.querySelector(".gselect")?.remove();
};
