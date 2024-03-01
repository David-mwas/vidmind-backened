// const mongoose = require("mongoose");

// const { getYoutubeTranscript } = require("./getYoutubeTranscript");
// const { generateEmbedding } = require("./generateEmbedding");
// const { getYoutubeVideoInfo } = require("./getYoutubeVideoInfo");

// const addVideoToAstra = async (url) => {
//   try {
//     const Video = mongoose.model("VideoDB");

//     const videoUrl = url;
//     // console.log(`videoUrl`, videoUrl)
//     const existingVideo = await Video.findOne({ url: videoUrl });
//     console.log(existingVideo);
//     if (existingVideo) {
//       console.log("Video already exists in the database");

//       return {
//         addedToAstra: false,
//         ...existingVideo.toJSON(),
//       };
//     } else {
//       let transcript = await getYoutubeTranscript(videoUrl);
//       console.log(`transcript ${transcript}`);
//       let vector = await generateEmbedding(transcript);
//       let videoInfo = await getYoutubeVideoInfo(videoUrl);
//       let addedVideo = await Video.create({
//         ...videoInfo,
//         url: videoUrl,
//         transcript,
//         $vector: vector,
//       });
//       console.log("Video inserted into the database");
//       return {
//         addedToAstra: true,
//         ...addedVideo.toJSON(),
//       };
//     }
//   } catch (e) {
//     console.error(`addVideoToAstra error ${e}`);
//   }
// };

// module.exports = { addVideoToAstra };

const mongoose = require("mongoose");
const { getYoutubeTranscript } = require("./getYoutubeTranscript");
const { generateEmbedding } = require("./generateEmbedding");
const { getYoutubeVideoInfo } = require("./getYoutubeVideoInfo");

const addVideoToMongoDB = async (url) => {
  try {
    const Video = require("../models/video");

    const videoUrl = url;

    const existingVideo = await Video.findOne({ url: videoUrl });

    if (existingVideo) {
      console.log("Video already exists in the database");

      return {
        addedToMongoDB: false,
        ...existingVideo.toJSON(),
      };
    } else {
      let transcript = await getYoutubeTranscript(videoUrl);
      console.log(`transcript ${transcript}`);
      let vector = await generateEmbedding(transcript);
      let videoInfo = await getYoutubeVideoInfo(videoUrl);

      let addedVideo = await Video.create({
        ...videoInfo,
        url: videoUrl,
        transcript,
        $vector: vector,
      });
      const videoId = addedVideo._id;
      console.log("Video inserted into the database");
      await addedVideo.save();
      return {
        addedToMongoDB: true,
        videoId,
        ...addedVideo.toJSON(),
      };
    }
  } catch (e) {
    console.error(`addVideoToMongoDB error ${e}`);
  }
};

module.exports = { addVideoToMongoDB };
