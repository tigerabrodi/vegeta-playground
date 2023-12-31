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
import { moveCursorToEnd } from "./utils";
import { fetchsuggestion } from "./fetchSuggestion";

export function App() {
  const [text, setText] = useState("Naruto is amazing.");
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [shouldShowSuggestion, setShouldShowSuggestion] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<string>>([]);
  const editableRef = useRef<HTMLSpanElement>(null);
  const latestTextRef = useRef("");

  useEffect(() => {
    if (editableRef.current) {
      editableRef.current.textContent = text;
      moveCursorToEnd(editableRef.current);
    }
  }, [text]);

  // useCallback needed for debounce to work
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateSuggestionsVisibility = useCallback(
    debounce(async () => {
      const hasUserStoppedTyping =
        latestTextRef.current === editableRef.current?.textContent;
      if (hasUserStoppedTyping) {
        await fetchsuggestion(latestTextRef.current, (suggestions) => {
          setSuggestions(suggestions);
          setSuggestionIndex(0);
          setShouldShowSuggestion(true);
        });
      } else {
        setShouldShowSuggestion(false);
      }
    }, 1000),
    []
  );

  const handleInput = (event: FormEvent<HTMLSpanElement>) => {
    const newText = event.currentTarget.textContent || "";
    setText(newText);
    latestTextRef.current = newText; // Update the latest text ref
    setShouldShowSuggestion(false);
    updateSuggestionsVisibility();
  };

  const jumpToNextSuggestion = () => {
    setSuggestionIndex((prevIndex) => (prevIndex + 1) % suggestions.length);
  };

  const appendCurrentSuggestion = () => {
    const currentText = editableRef.current?.textContent || "";
    setText(currentText + suggestions[suggestionIndex]);
    latestTextRef.current = currentText + suggestions[suggestionIndex]; // Update latest text ref
    setShouldShowSuggestion(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    if (event.key === "ArrowRight" && shouldShowSuggestion) {
      if (event.shiftKey) {
        jumpToNextSuggestion();
      } else {
        appendCurrentSuggestion();
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
            <span className="placeholder">{suggestions[suggestionIndex]}</span>
          )}
        </span>
      </div>
    </main>
  );
}
