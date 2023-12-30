# Vegeta's Playground

![image](https://github.com/narutosstudent/vegeta-playground/assets/49603590/1b8abb4d-3f91-4b8b-8e2d-1bb8b4bd7d2a)

# Learnings

## Content Editable Elements

- Everytime we updated controlled state, React re renders the component. This caused `contentEditable` span to be updated with new value.
- Because of this update, browser treated it as fresh content being set into the `contentEditable` span and hence the cursor was moved to the beginning of span.
- To avoid this, we decouple the display of text in the span from state. We set the text state, however, on every re render, we set the content ref of the span to the text.

## Circular Array

`setSuggestionIndex((prevIndex) => (prevIndex + 1) % ARRAY_SUGGESTIONS.length);` How does this work?

This is a common pattern for circular array. We use the remainder operator to get the index. This is because the remainder operator always returns a positive number. So, if we are at the end of the array, we get the index 0. Which would mean looping back to the first element.

## Why we need useState for text

Changes to the `ref` value do not trigger re render. This leads to troubles with inconsistent state. To avoid this, we use `useState` to store the text value and be in full control.

## Cursor Management

### document.createRange()

`document.createRange()` creates a new range object. A range object represents a fragment of a document that can contain nodes and parts of text nodes in a given document.

They're often used in combination with the `Selection` object, which represents the selection of text in the document that the user has made, or the current position of the caret.

### window.getSelection()

`window.getSelection()` returns a `Selection` object representing the range of text selected by the user or the current position of the caret.

To modify the selection, you can use `Selection` methods like `Selection.addRange()` and `Selection.collapse()`.

Commonly used for copy/cut, text highlighting etc.

### Code

```ts
/**
 * Moves the cursor to the end of the specified HTML element.
 */
const moveCursorToEnd = (element: HTMLElement) => {
  // Create a new 'Range' object. This will be used to specify the new cursor position.
  const range = document.createRange();

  // Get the current text or element selection in the document.
  const selection = window.getSelection();

  // If there's no selection object, exit the function to avoid errors.
  if (!selection) return;

  // Set the range to cover all contents of the element. This is like selecting all text in the element.
  range.selectNodeContents(element);

  // Collapse the range to its end. This means moving the selection point to the end of the element's text.
  range.collapse(false);

  // Clear any existing text selections in the document to avoid conflicts.
  selection.removeAllRanges();

  // Apply the new range to the selection. This step actually moves the cursor to the end of the element.
  selection.addRange(range);
};
```
