export const removeGroup = () => {
  const group = document.querySelector(".group");
  group?.childNodes.forEach((node) =>
    document.querySelector(".svg")?.appendChild(node)
  );
  if (group?.childNodes.length != 0) {
    removeGroup();
  }
};
