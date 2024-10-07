/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 */
// systemInstruction: ` The following YouTube video transcript:\n\n${video.transcript}\n\nAnswer the following question or questions based on the transcript.`,
// "Summarise what this video is about, and point out three key learnings"
const addChatGPTresponse = async (
  video,
  messages = [],
  message = "Summarize"
) => {
  const { GoogleGenerativeAI } = require("@google/generative-ai");

  const apiKey = process.env.API_KEY; // Use your environment variable
  const genAI = new GoogleGenerativeAI(apiKey);
  console.log("Transcript =", video?.transcript);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction:
      "You will be provided with a transcript from a YouTube video; your role is to summarize it and give feedback based on the questions asked.",
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
  };

  const chatSession = model.startChat({
    generationConfig,
    history: messages,
  });

  const result = await chatSession.sendMessage(video?.transcript);
  const text = result.response.text();

  // Ensure messages is initialized before pushing
//  const text = result.response.text(); // Ensure this returns a valid string
 messages.push({
   role: "model",
   content: text, // Correct this to use content instead of parts
 });


  console.log("Updated messages:", messages);
  return messages;
};

module.exports = { addChatGPTresponse };
