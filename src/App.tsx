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
import { parseSuggestion } from "./parseSuggestion";

export function App() {
  const [text, setText] = useState("Naruto is amazing.");
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

        console.log(latestTextRef.current);

        const prompt = `I'm building a text editor with AI auto completion.\n\nThis is my current text: "${latestTextRef.current}"\n\nI want you to give me 3 suggestions to continue this text. Each suggestion should be two sentences. Do not include the existing text (it's unnecessary), your goal is to add suggestions of how the text continues. If the current text is not a completed sentence (not ending with punctuation that defines end of sentence e.g. question mark), then each suggestion should complete the sentence and then add 2 more sentences.\n\nFor example, if the text is "Naruto is great, because", then you would complete it by giving me " he never gives up". In addition to completing it, you would add two new sentences.So it would end up being " he never gives up. {two more sentences}".\n\nIf the text had been "Naruto is amazing.", we know it is a full sentence, so you just simply give me two sentences for each suggestion.\n\nTo recap: we would have 3 suggestions, each with 2 sentences or completing the current text if sentence is incomplete, then add 2 sentences. Enter your suggestions like:\n\n>first suggestion>second suggestion>third suggestion\n\n`;

        const payload = {
          model: "gpt-4-1106-preview",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.5, // how creative suggestions are
          frequency_penalty: 0.2, // how repetitive words are
          presence_penalty: 0.2, // how repetitive topics are
          max_tokens: 300,
        };

        try {
          console.log("fetching suggestions");
          const response = await fetch(
            "https://api.openai.com/v1/chat/completions",
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${import.meta.env.VITE_OPENAI_KEY}`,
              },
              method: "POST",
              body: JSON.stringify(payload),
            }
          );

          setSuggestions(parseSuggestion(await response.json()));
          setSuggestionIndex(0);
          setShouldShowSuggestion(true);
        } catch (error) {
          console.error(error);
          throw error;
        }
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

  console.log("suggestions", suggestions);

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
