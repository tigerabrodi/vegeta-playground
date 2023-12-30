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

export function App() {
  const [text, setText] = useState("Vegeta's playground");
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [shouldShowSuggestion, setShouldShowSuggestion] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
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
    debounce(async () => {
      const hasUserStoppedTyping =
        latestTextRef.current === editableRef.current?.textContent;
      if (hasUserStoppedTyping) {
        // Fetch suggestions from GPT 4 API

        const prompt = `This is my current text: "${text}"\n\nI want you to give me 5 suggestions to continue this text. Each suggestion should be two sentences. If the current text is not a completed sentence, then each suggestion should complete the sentence and then add 2 more sentences. So all in all, we would have 5 suggestions, each with 2 sentences or 2 sentences and completing the current text if the last sentence is incomplete.Enter your suggestions like:\n\n1. "first suggestion" 2. "second suggestion" 3. "third suggestion" 4. "fourth suggestion" 5. "fifth suggestion"\n\n`;

        const payload = {
          model: "gpt-4-1106-preview",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.5,
          frequency_penalty: 0.5,
          presence_penalty: 0.5,
          max_tokens: 4000,
        };

        try {
          console.log("fetching suggestions");
          const response = await fetch(
            "https://api.openai.com/v1/chat/completions",
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${import.meta.env.VITE_OPEN_API_KEY}`,
              },
              method: "POST",
              body: JSON.stringify(payload),
            }
          );

          console.log(response);
        } catch (error) {
          console.error(error);
        }

        setSuggestionIndex(0);
        setShouldShowSuggestion(true);
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
        setSuggestionIndex((prevIndex) => (prevIndex + 1) % suggestions.length);
      } else {
        const currentText = editableRef.current?.textContent || "";
        setText(currentText + suggestions[suggestionIndex]);
        latestTextRef.current = currentText + suggestions[suggestionIndex]; // Update latest text ref
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
            <span className="placeholder">{suggestions[suggestionIndex]}</span>
          )}
        </span>
      </div>
    </main>
  );
}
