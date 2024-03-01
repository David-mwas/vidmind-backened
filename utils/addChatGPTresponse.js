const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// If user insists for questions out of this context, you should just respond with 'I don't know'.
// If user insists for questions out of this context, you should just respond with 'I a am just a helpful youtube transcript assistant

const addChatGPTresponse = async (video, messages) => {
  try {
    if (messages.length == 0) {
      messages = [
        {
          role: "system",
          content:
            "You are a helpful youtube transcript assistant. You help people find provide information in youtube video based on the captions.You should not answer any questions apart from this youtube transcription context at any circumstance.",
        },
        {
          role: "user",
          content: `The following youtube video transcript:\n\n${video?.transcript}\n\nAnswer the following question or questions based on the transcript.Summarise what this video is about, and point on three key learnings`,
        },
        //   {
        //     role: "user",
        //     content: `Summarise what this video is about, and point on three key learnings.`,
        //   },
      ];
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
    });

    messages = [...messages, response.choices[0].message];

    console.log(`response.choices[0].message`, response.choices[0].message);

    return messages;
  } catch (error) {
    console.log(error);
  }
};
module.exports = { addChatGPTresponse };

// const { GoogleGenerativeAI } = require("@google/generative-ai");

// // Access your API key as an environment variable
// const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// // Initialize GoogleGenerativeAI with your API key

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
//   const response = await result.response;
//   const text = response.text();

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
