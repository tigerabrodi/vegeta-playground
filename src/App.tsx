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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const editableRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (editableRef.current) {
      editableRef.current.textContent = text;
    }
  }, []);

  // Create a debounced function to handle showing suggestions
  const handleShowSuggestions = useCallback(
    debounce(() => {
      if (text) {
        setShowSuggestions(true);
        setSuggestionIndex(0);
      }
    }, 500),
    [text] // Re-create this function when 'text' changes
  );

  function resetSuggestion() {
    setShowSuggestions(false);
    setSuggestionIndex(0);
  }

  const handleInput = (event: FormEvent<HTMLSpanElement>) => {
    const newText = event.currentTarget.textContent || "";
    setText(newText);
    resetSuggestion();
    handleShowSuggestions();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    if (event.key === "ArrowRight" && showSuggestions) {
      if (event.shiftKey) {
        setSuggestionIndex(
          (prevIndex) => (prevIndex + 1) % ARRAY_SUGGESTIONS.length
        );
      } else {
        setText(text + ARRAY_SUGGESTIONS[suggestionIndex]);
        setShowSuggestions(false);
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
          {!text && !showSuggestions && (
            <span className="placeholder">Type something...</span>
          )}
          {showSuggestions && text && (
            <span className="suggestions">
              {" "}
              {ARRAY_SUGGESTIONS[suggestionIndex]}
            </span>
          )}
        </span>
      </div>
    </main>
  );
}
