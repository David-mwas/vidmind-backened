const ytdl = require("@distube/ytdl-core");

const getYoutubeVideoInfo = async (url) => {
  try {
    let info = await ytdl.getBasicInfo(url);
    console.log(getYoutubeVideoInfo, info);
    const videoDetails = info?.videoDetails;
    console.log(`videoDetails ${videoDetails}`);
    if (!videoDetails) {
      console.error("No video details found");
      return null;
    }
    const author = videoDetails?.author;
    const videoInfo = {
      url: videoDetails?.video_url,
      title: videoDetails?.title,
      description: videoDetails?.description,
      author: author?.name,
      author_thumbnail: author?.thumbnails[author?.thumbnails.length - 1].url,
      thumbnail:
        videoDetails?.thumbnails[videoDetails?.thumbnails.length - 1].url,
    };
    // console.log(videoInfo);
    // console.log(` getYoutubeVideoInfo details ${videoDetails}`);
    return videoInfo;
  } catch (e) {
    console.error(e);
  }
};

// getYoutubeVideoInfo("https://www.youtube.com/watch?v=m4-HM_sCvtQ");

module.exports = { getYoutubeVideoInfo };
