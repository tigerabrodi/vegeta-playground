import {
  useState,
  useRef,
  useEffect,
  FormEvent,
  KeyboardEvent,
  useCallback,
} from "react";
import debounce from "lodash.debounce";
import "./App.css";

const ARRAY_SUGGESTIONS = [
  "The sun set over the horizon, painting the sky with hues of orange and pink. A gentle breeze rustled the leaves of the nearby trees.",
  "In the heart of the bustling city, the sound of traffic filled the air. Street vendors called out, offering a variety of local delicacies.",
  "The library was a haven of quiet, filled with the musty scent of old books. Students sat at scattered tables, lost in their studies.",
  "High atop the mountain, the view was breathtaking. The vast landscape stretched out below, a mosaic of colors and textures.",
  "The old clock tower chimed the hour, its sound echoing through the cobblestone streets. People hurried along, wrapped up in their daily routines.",
];

export function App() {
  const [text, setText] = useState("Vegeta's playground");
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [shouldShowSuggestion, setShouldShowSuggestion] = useState(false);
  const editableRef = useRef<HTMLSpanElement>(null);
  const latestTextRef = useRef("");

  useEffect(() => {
    if (editableRef.current) {
      editableRef.current.textContent = text;
      moveCursorToEnd(editableRef.current);
    }
  }, [text]);

  const moveCursorToEnd = (element: HTMLElement) => {
    const range = document.createRange();
    const selection = window.getSelection();
    if (!selection) return;
    range.selectNodeContents(element);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateSuggestionsVisibility = useCallback(
    debounce(() => {
      const hasUserStoppedTyping =
        latestTextRef.current === editableRef.current?.textContent;
      if (hasUserStoppedTyping) {
        setShouldShowSuggestion(true);
        setSuggestionIndex(0);
      } else {
        setShouldShowSuggestion(false);
      }
    }, 800),
    []
  );

  const handleInput = (event: FormEvent<HTMLSpanElement>) => {
    const newText = event.currentTarget.textContent || "";
    setText(newText);
    latestTextRef.current = newText; // Update the latest text ref
    setShouldShowSuggestion(false);
    updateSuggestionsVisibility();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    if (event.key === "ArrowRight" && shouldShowSuggestion) {
      if (event.shiftKey) {
        setSuggestionIndex(
          (prevIndex) => (prevIndex + 1) % ARRAY_SUGGESTIONS.length
        );
      } else {
        const currentText = editableRef.current?.textContent || "";
        setText(currentText + ARRAY_SUGGESTIONS[suggestionIndex]);
        latestTextRef.current =
          currentText + ARRAY_SUGGESTIONS[suggestionIndex]; // Update latest text ref
        setShouldShowSuggestion(false);
      }
    }
  };

  return (
    <main>
      <h1>Vegeta's Playground</h1>
      <div className="content">
        <span className="editable-text-wrapper">
          <span
            contentEditable
            className="editable-text"
            ref={editableRef}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
          />
          {!text && !shouldShowSuggestion && (
            <span className="placeholder">Type something...</span>
          )}
          {shouldShowSuggestion && text && (
            <span className="placeholder">
              {ARRAY_SUGGESTIONS[suggestionIndex]}
            </span>
          )}
        </span>
      </div>
    </main>
  );
}
