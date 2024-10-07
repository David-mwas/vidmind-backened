const mongoose = require("mongoose");
// const { driver, createAstraUri } = require("stargate-mongoose");

// const connectToAstraDb = async () => {
//   const uri = createAstraUri(
//     process.env.ASTRA_DB_ID,
//     process.env.ASTRA_DB_REGION,
//     process.env.ASTRA_DB_KEYSPACE,
//     process.env.ASTRA_DB_APPLICATION_TOKEN
//   );

//   mongoose.set("autoCreate", true);
//   mongoose.setDriver(driver);

//   await mongoose.connect(process.env.mongoDB_URI, {
//     isAstra: true,
//   });
// };

// const initMongooseVideoModel = async () => {
// await mongoose.connection.dropCollection("videos");
const VideoSchema = new mongoose.Schema(
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
      validate: (vector) => vector && vector.length === 768,
    },
  },
  {
    collectionOptions: {
      vector: {
        size: 768,
        function: "cosine",
      },
    },
  }
);

// await Video.init();
// };

module.exports = mongoose.model("VideoDB", VideoSchema);
