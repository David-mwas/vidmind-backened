/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 */
// systemInstruction: ` The following YouTube video transcript:\n\n${video.transcript}\n\nAnswer the following question or questions based on the transcript.`,
// "Summarise what this video is about, and point out three key learnings"
const addChatGPTresponse = async ({
  video,
  messages = [],
  prompt = "Summarize",
}) => {
  try {
    console.log(prompt);
    // console.log("addChatGPTresponse called: messages", [...messages]);
    const { GoogleGenerativeAI } = require("@google/generative-ai");

    const apiKey = process.env.API_KEY; // Use your environment variable
    const genAI = new GoogleGenerativeAI(apiKey);
    // console.log("Transcript =", video?.transcript);
    // gemini - 1.0 - pro;
    // gemini - 1.5 - flash;
    // 8192;
    const model = genAI.getGenerativeModel({
      model: "gemini-1.0-pro",
      systemInstruction:
        "You are a helpful youtube transcript assistant. You help people find information in youtube video based on the transcript.You should not answer any questions apart from the given youtube transcription context at any circumstance.",
    });
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };

    const chatSession = model.startChat({
      generationConfig,
      safetySettings,
      history: [
        {
          role: "model",
          parts: [
            {
              text: "I am a helpful youtube transcript assistant. I help people find information in youtube video based on the transcript.You should not answer any questions apart from the given youtube transcription context at any circumstance.",
            },
          ],
        },
        {
          role: "user",
          parts: [
            {
              text: `The following youtube video transcript:\n\n${video?.transcript}\n\nAnswer the following question or questions based on the transcript.Summarise what this video is about, and point on three key learnings.You should not answer any questions apart from the given youtube transcription context at any circumstance.`,
            },
            {
              text: "Summarise what this video is about, and point out three key learnings.You should not answer any questions apart from the given youtube transcription context at any circumstance",
            },
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage(prompt);
    console.log("Result", result);
    const text = result.response.text();

    // Ensure messages is initialized before pushing
    //  const text = result.response.text(); // Ensure this returns a valid string
    messages.push({
      role: "model",
      content: text, // Correct this to use content instead of parts
    });

    // console.log("Updated messages:", messages);
    return messages;
  } catch (error) {
    console.error("Error...", error);
  }
};

module.exports = { addChatGPTresponse };
