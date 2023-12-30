# Vegeta's Playground

![image](https://github.com/narutosstudent/vegeta-playground/assets/49603590/1b8abb4d-3f91-4b8b-8e2d-1bb8b4bd7d2a)

# Learnings

## Content Editable Elements

- Everytime we updated controlled state, React re renders the component. This caused `contentEditable` span to be updated with new value.
- Because of this update, browser treated it as fresh content being set into the `contentEditable` span and hence the cursor was moved to the beginning of span.
- To avoid this, we decouple the display of text in the span from state. We set the text state, however, on every re render, we set the content ref of the span to the text.

## Circular Array

## Why we need useState for text

Changes to the `ref` value do not trigger re render. This leads to troubles with inconsistent state. To avoid this, we use `useState` to store the text value and be in full control.

## Cursor Management

### document.createRange()

### window.getSelection()

### Code

const moveCursorToEnd = (element: HTMLElement) => {
const range = document.createRange();
const selection = window.getSelection();
if (!selection) return;
range.selectNodeContents(element);
range.collapse(false);
selection.removeAllRanges();
selection.addRange(range);
};
