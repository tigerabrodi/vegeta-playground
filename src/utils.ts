export const moveCursorToEnd = (element: HTMLElement) => {
  const range = document.createRange();
  const selection = window.getSelection();
  if (!selection) return;
  range.selectNodeContents(element);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
};
