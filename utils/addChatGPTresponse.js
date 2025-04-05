/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 */

const video = require("../models/video");

const addChatGPTresponse = async (video, messages) => {
  try {
    const {
      GoogleGenerativeAI,
      HarmCategory,
      HarmBlockThreshold,
    } = require("@google/generative-ai");

    const apiKey = "AIzaSyAxkTPGnDh7FSqJoHyKwvZyK9gEW7KEAD0";
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `The following YouTube video transcript:\n\n${video.transcript}\n\nAnswer the following question or questions based on the transcript.`,
    });

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,

      //   responseMimeType: "application/json",
    };

    const chatSession = model.startChat({
      generationConfig,
      // safetySettings: Adjust safety settings
      // See https://ai.google.dev/gemini-api/docs/safety-settings
      history: [
        {
          role: "user",
          parts: [
            {
              text: "Summarise what this video is about, and point out three key learnings",
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: "I am a youtube helpful assistant designed to summarize youtube videos based on transcript context. Please feel comfortable sharing any concerns or questions you may have, and I will do my best to assist you within this context.",
            },
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage(messages);
    console.log(result.response.text());

    const text = result.response.text();
    messages.push({
      role: "model",
      parts: [{ content: text }],
    });

    return messages;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { addChatGPTresponse };
// const { GoogleGenerativeAI } = require("@google/generative-ai");

// // // Access your API key as an environment variable
// const genAI = new GoogleGenerativeAI(process.env.API_KEY);
// const generationConfig = {
//   temperature: 1,
//   topP: 0.95,
//   topK: 64,
//   maxOutputTokens: 8192,

//   //   responseMimeType: "application/json",
// };
// const addChatGPTresponse = async (video, messages) => {
//   try {
//     if (messages.length === 0) {
//       messages = [
//         {
//           role: "user",
//           parts: [
//             {
//               content: `The following YouTube video transcript:\n\n${video.transcript}\n\nAnswer the following question or questions based on the transcript.`,
//             },
//             {
//               content:
//                 "Summarise what this video is about, and point out three key learnings.",
//             },
//           ],
//         },
//       ];
//     }

//     // For text-only input, use the gemini-pro model
//     const model = genAI.getGenerativeModel({ model: "gemini-pro" });

//     // Create a chat with the initial messages
//     const chat = model.startChat({ generationConfig, messages });

//     // Get the user's latest message
//     const userMessage = messages[messages.length - 1];
//     console.log(`userMessage...`, userMessage);

//     // Send the user's message to the chat
//     const result = await chat.sendMessage(messages);
//     const response = await result.response;
//     const text = response.text();

//     // Add the model's response to the messages
//     messages.push({
//       role: "model",
//       parts: [{ content: text }],
//     });

//     return messages;
//   } catch (error) {
//     console.log(error);
//   }
// };

// module.exports = { addChatGPTresponse };

// const { OpenAI } = require("openai");
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// // If user insists for questions out of this context, you should just respond with 'I don't know'.
// // If user insists for questions out of this context, you should just respond with 'I a am just a helpful youtube transcript assistant

// const addChatGPTresponse = async (video, messages) => {
//   try {
//     if (messages.length == 0) {
//       messages = [
//         {
//           role: "system",
//           content:
//             "You are a helpful youtube transcript assistant. You help people find provide information in youtube video based on the captions.You should not answer any questions apart from this youtube transcription context at any circumstance.If provided transcript is undefined just say provided video has no transcript.",
//         },
//         {
//           role: "user",
//           content: `The following youtube video transcript:\n\n${video?.transcript}\n\nAnswer the following question or questions based on the transcript.Summarise what this video is about, and point on 10 key learnings.If provided transcript is undefined just say provided video has no transcript.`,
//         },
//         //   {
//         //     role: "user",
//         //     content: `Summarise what this video is about, and point on three key learnings.`,
//         //   },
//       ];
//     }

//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages,
//     });

//     messages = [...messages, response.choices[0].message];

//     console.log(`response.choices[0].message`, response.choices[0].message);

//     return messages;
//   } catch (error) {
//     console.log(error);
//   }
// };
// module.exports = { addChatGPTresponse };
// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// const addChatGPTresponse = async (video, messages) => {
//   try {
//     if (messages.length === 0) {
//       messages = [
//         {
//           role: "user",
//           content: `The following YouTube video transcript:\n\n${video.transcript}\n\nAnswer the following question or questions based on the transcript.`,
//         },
//         {
//           role: "user",
//           content:
//             "Summarise what this video is about, and point out three key learnings.",
//         },
//       ];
//     }

//     // For text-only input, use the gemini-pro model
//     const model = genAI.getGenerativeModel({ model: "gemini-pro" });

//     // Create a chat with the initial messages
//     const chat = model.startChat({ messages });
//     console.log("chat", chat);

//     // Send the user's message to the chat
//     const result = await chat.sendMessage(messages);
//     const response = await result.response;
//     const text = response.text();

//     // Add the model's response to the messages
//     messages.push({
//       role: "model",
//       content: text, // Use content instead of parts
//     });

//     return messages;
//   } catch (error) {
//     console.error(error);
//     throw new Error("Error generating response");
//   }
// };

// module.exports = { addChatGPTresponse };

// const { GoogleGenerativeAI } = require("@google/generative-ai");

// // // Access your API key as an environment variable
// const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// // // Initialize GoogleGenerativeAI with your API key

// const addChatGPTresponse = async (video, messages) => {
//   if (messages.length === 0) {
//     messages = [
//       {
//         role: "user",
//         parts: [
//           {
//             content: `The following YouTube video transcript:\n\n${video.transcript}\n\nAnswer the following question or questions based on the transcript.`,
//           },
//           {
//             content:
//               "Summarise what this video is about, and point out three key learnings.",
//           },
//         ],
//       },
//     ];
//   }

//   // For text-only input, use the gemini-pro model
//   const model = genAI.getGenerativeModel({ model: "gemini-pro" });

//   // Create a chat with the initial messages
//   const chat = model.startChat({ messages });

//   // Get the user's latest message
//   const userMessage = messages[messages.length - 1];
//   console.log(`userMessage...`, userMessage);
//   // const dat = userMessage?.content || userMessage?.parts[0]?.content;
//   let data = [...messages, userMessage];

//   // Send the user's message to the chat
//   const result = await chat.sendMessage(data);
//   console.log(`result ${result}`);
//   const response = await result.response;
//   console.log("response...addChatGPTresponse  " + response);
//   const text = response.text();
//   console.log(`text ${text}`);
//   // Add the model's response to the messages
//   messages.push({
//     role: "model",
//     parts: [{ content: text }],
//   });

//   // console.log(messages[1].parts[0].content);
//   // for (let i = 0; i < messages.length; i++) {
//   //   console.log(messages.length);
//   // }

//   return messages;
//   // rutokevin899;
// };

// module.exports = { addChatGPTresponse };

// node --version # Should be >= 18
// npm install @google/generative-ai

// const {
//   GoogleGenerativeAI,
//   HarmCategory,
//   HarmBlockThreshold,
// } = require("@google/generative-ai");

// const MODEL_NAME = "gemini-1.0-pro";
// const API_KEY = "AIzaSyAlt94MEM4PZZEdapMEbV-4g25DB-CbnY8";

// async function runChat(messages = []) {
//   const genAI = new GoogleGenerativeAI(API_KEY);
//   const model = genAI.getGenerativeModel({ model: MODEL_NAME });

//   const generationConfig = {
//     temperature: 0.9,
//     topK: 1,
//     topP: 1,
//     maxOutputTokens: 2048,
//   };

//   const safetySettings = [
//     {
//       category: HarmCategory.HARM_CATEGORY_HARASSMENT,
//       threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
//     },
//     {
//       category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
//       threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
//     },
//     {
//       category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
//       threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
//     },
//     {
//       category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
//       threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
//     },
//   ];

//   const chat = model.startChat({
//     generationConfig,
//     safetySettings,1
//     history: [
//       {
//         role: "user",
//         parts: [
//           {
//             text: "You are mindful assistant and you help people with mental health issues. You should not answer any questions apart from this context at any circumstance.",
//           },
//         ],
//       },
//       {
//         role: "model",
//         parts: [
//           {
//             text: "I am a mindful assistant designed to provide support and guidance on mental health topics. Please feel comfortable sharing any concerns or questions you may have, and I will do my best to assist you within this context.",
//           },
//         ],
//       },
//     ],
//   });

//   const result = await chat.sendMessage("hello mum. what are we eating");
//   const response = result.response;
//   console.log(response.text());
// }

// runChat();
