import fs from "fs";
import path from "path";
import { create } from "@openai/api";

const openai = create("");

const speechFile = path.resolve("./speech.mp3");

async function main() {
  const result = await openai.complete({
    engine: "davinci",
    prompt: "Today is a wonderful day to build something people love!",
    max_tokens: 50,
    temperature: 0.7,
    stop: "\n",
  });

  const { choices } = result.data;
  const { text } = choices[0];
  const buffer = Buffer.from(text, "base64");

  await fs.promises.writeFile(speechFile, buffer);
}

main();
