import { YoutubeTranscript } from 'youtube-transcript';
let comments = await YoutubeTranscript.fetchTranscript("pfaSUYaSgRo");
console.log(comments)
// https://youtu.be/rrB13utjYV4?si=XryTSDw0w5DGMNJN
// https://youtu.be/CCxbI1qRsWY?si=UkPGJgDbevvhYQPV

// const { YoutubeTranscript } = require("youtube-transcript");

// let txt = await YoutubeTranscript.fetchTranscript(
//   "https://www.youtube.com/watch?v=pfaSUYaSgRo"
// );
// //   .then((data) => console.log(data))
// //   .catch((err) => console.error(err));
// console.log(txt);
