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
const Video = require("../models/video");
const addVideoToMongoDB = async (url) => {
  console.log("invoked....");
  const videoInfoo = await getYoutubeVideoInfo(url);
  console.log(videoInfoo);
  try {
    const videoUrl = url;
    // console.log("videoUrl..." + videoUrl);
    const existingVideo = await Video.findOne({ url: videoUrl });

    if (existingVideo) {
      // console.log("Video already exists in the database", existingVideo);

      return {
        addedToMongoDB: false,
        ...existingVideo.toJSON(),
      };
    } else {
      let transcript = await getYoutubeTranscript(videoUrl);
      console.log(`transcript ${transcript}`);
      let vector = await generateEmbedding(transcript);
      console.log(`vector ${vector}`);
      let videoInfo = await getYoutubeVideoInfo(videoUrl);
      console.log("videoInfo", videoInfo);
      let addedVideo = await Video.create({
        ...videoInfo,
        url: videoUrl,
        transcript,
        $vector: vector,
      });
      const videoId = addedVideo?._id;
      // console.log("Video inserted into the database", addedVideo);
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
