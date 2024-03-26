const fetch = require("node-fetch");
require("dotenv").config();
// const generateEmbedding = async (prompt) => {
//   const response = await fetch("https://api.openai.com/v1/embeddings", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//     },
//     body: JSON.stringify({
//       input: prompt,
//       model: "text-embedding-ada-002",
//     }),
//   });

//   if (response.status != 200) {
//     throw `chatgpt Failed to generate embedding: ${response.statusText}`;
//   }

//   const result = await response.json();

//   return result.data[0].embedding;
// };

// module.exports = { generateEmbedding };
const prompt = "hello gemin i model";
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const generateEmbedding = async (prompt) => {
  // For embeddings, use the embedding-001 model
  try {
    const model = genAI.getGenerativeModel({ model: "embedding-001" });

    // const text = "The quick brown fox jumps over the lazy dog.";
    const result = await model?.embedContent(prompt);
    const embedding = result?.embedding;
    console.log("Embedding Length:", embedding.length);
    return embedding?.values;
  } catch (error) {
    console.error(error);
  }
};
generateEmbedding(prompt);

module.exports = { generateEmbedding };
