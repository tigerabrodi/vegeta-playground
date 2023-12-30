import { useState, useRef, useEffect, FormEvent } from "react";
import "./App.css";

export function App() {
  const [text, setText] = useState<string>("Vegeta's playground");
  const positionRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (positionRef.current) {
      positionRef.current.textContent = text;
    }
  }, []);

  const handleInput = (event: FormEvent<HTMLSpanElement>) => {
    const newText = event.currentTarget.textContent || "";
    console.log("New text:", newText);
    setText(newText);
  };

  return (
    <main>
      <h1>Vegeta's Playground</h1>
      <div className="content">
        <span
          contentEditable
          className="editable-text"
          ref={positionRef}
          onInput={handleInput}
        />
      </div>
    </main>
  );
}
