const youtubeUrlRegex =
  /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

const url = "https://youtube.com/watch?v=mVKAyw0xqxw";
if (youtubeUrlRegex.test(url)) {
  console.log("Valid YouTube URL");
} else {
  console.log("Not a valid YouTube URL");
}
