const { YoutubeTranscript } = require("youtube-transcript");

const getVideoIdFromUrl = (url) => {
  // console.log(`getVideoIdFromUrl: ${url}`);
  let videoId = url?.split("v=")[1];
  const ampersandPosition = videoId?.indexOf("&");
  // console.log(`ampersandPosition: ${ampersandPosition}`);
  if (ampersandPosition !== -1) {
    videoId = videoId?.substring(0, ampersandPosition);
  }
  return videoId;
};

const convertYoutubeTranscriptJsonToString = async (jsonYoutubeTranscript) => {
  let stringYoutubeTranscript = "";
  for (let i = 0; i < jsonYoutubeTranscript?.length; i++) {
    if (i > 0) {
      stringYoutubeTranscript += " ";
    }
    stringYoutubeTranscript += jsonYoutubeTranscript[i]?.text;
  }
  return stringYoutubeTranscript;
};

const getYoutubeTranscript = async (url, transcripts) => {
  console.log("Invoked gyt...");
  const videoId = getVideoIdFromUrl(url);
  const transcriptJson = await YoutubeTranscript.fetchTranscript(videoId);
  console.log(`transcriptJson ${transcriptJson}`);
  const transcriptString = await convertYoutubeTranscriptJsonToString(
    transcriptJson
  );
  // console.log(`getYoutubeTranscript ${transcriptString}`);
  if (transcriptString && transcriptString !== undefined) {
    return transcriptString;
  } else {
    return transcripts;
  }
};

module.exports = { getYoutubeTranscript };
