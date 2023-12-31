import { Suggestion, parseSuggestion } from "./parseSuggestion";

export const fetchsuggestion = async (
  text: string,
  callback: (parsedSuggestion: Array<string>) => void
) => {
  const prompt = `I'm building a text editor with AI auto completion.\n\nThis is my current text: "${text}"\n\nI want you to give me 3 suggestions to continue this text. Each suggestion should be two sentences. Do not include the existing text (it's unnecessary), your goal is to add suggestions of how the text continues. If the current text is not a completed sentence (not ending with punctuation that defines end of sentence e.g. question mark), then each suggestion should complete the sentence and then add 2 more sentences.\n\nFor example, if the text is "Naruto is great, because", then you would complete it by giving me " he never gives up". Another example, if text is "Naruto is a", then you would complete it with "mazing.". In addition to completing it, you would add two new sentences. So it would end up being " he never gives up. {two more sentences}".\n\nIf the text had been "Naruto is amazing.", we know it is a full sentence, so you just simply give me two sentences for each suggestion. If the text ends without a space, then add a space to the beginning of each suggestion.\n\nTo recap: we would have 3 suggestions, each with 2 sentences or completing the current text if sentence is incomplete, then add 2 sentences. Enter your suggestions like:\n\n>first suggestion>second suggestion>third suggestion\n\n`;

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
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_KEY}`,
      },
      method: "POST",
      body: JSON.stringify(payload),
    });

    callback(parseSuggestion((await response.json()) as Suggestion));
  } catch (error) {
    console.error(error);
    throw error;
  }
};
