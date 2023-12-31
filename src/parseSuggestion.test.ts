import { it, expect } from "vitest";
import { Suggestion, parseSuggestion } from "./parseSuggestion";

const suggestion: Suggestion = {
  choices: [
    {
      message: {
        content: `>His dedication to becoming Hokage inspires everyone around him. His unwavering spirit and the bonds he forms with friends and rivals alike are the heart of the series.
>The depth of the characters and the intricate world-building make the series a staple in anime culture. It's not just the action scenes, but also the emotional journeys that capture the audience's attention.
>He embodies the true spirit of perseverance and loyalty, which resonates with fans across the globe. The show's mix of humor, drama, and action creates a rich story that keeps viewers hooked episode after episode.`,
      },
    },
  ],
};

it("should parse suggestion", () => {
  expect(parseSuggestion(suggestion)).toEqual([
    "His dedication to becoming Hokage inspires everyone around him. His unwavering spirit and the bonds he forms with friends and rivals alike are the heart of the series.",
    "The depth of the characters and the intricate world-building make the series a staple in anime culture. It's not just the action scenes, but also the emotional journeys that capture the audience's attention.",
    "He embodies the true spirit of perseverance and loyalty, which resonates with fans across the globe. The show's mix of humor, drama, and action creates a rich story that keeps viewers hooked episode after episode.",
  ]);
});
