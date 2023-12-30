import { useState, useRef, useEffect, FormEvent } from "react";
import "./App.css";

const ARRAY_SUGGESTIONS = [
  "The sun set over the horizon, painting the sky with hues of orange and pink. A gentle breeze rustled the leaves of the nearby trees.",
  "In the heart of the bustling city, the sound of traffic filled the air. Street vendors called out, offering a variety of local delicacies.",
  "The library was a haven of quiet, filled with the musty scent of old books. Students sat at scattered tables, lost in their studies.",
  "High atop the mountain, the view was breathtaking. The vast landscape stretched out below, a mosaic of colors and textures.",
  "The old clock tower chimed the hour, its sound echoing through the cobblestone streets. People hurried along, wrapped up in their daily routines.",
];

export function App() {
  const [text, setText] = useState<string>("Vegeta's playground");
  const editableRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (editableRef.current) {
      editableRef.current.textContent = text;
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
        <span className="editable-text-wrapper">
          <span
            contentEditable
            className="editable-text"
            ref={editableRef}
            onInput={handleInput}
          />
          {!text && <span className="placeholder">Type something...</span>}
        </span>
      </div>
    </main>
  );
}
