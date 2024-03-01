const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    url: String,
    author: String,
    thumbnail: String,
    author_thumbnail: String,
    transcript: String,
    $vector: {
      type: [Number],
      // validate: (vector) => vector && vector.length === 1536,
    },
  },
  {
    collectionOptions: {
      vector: {
        size: 1536,
        function: "cosine",
      },
    },
  }
);

module.exports = mongoose.model("VideoDB", videoSchema);
