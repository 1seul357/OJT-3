export const dragItem = (e: CustomEvent) => {
  const { handler, box } = e.detail;
  e.preventDefault();
  handler.move(box.x, box.y);
};
