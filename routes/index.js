const router = require("express").Router();
const { resolve } = require("path");
const getAudioBitrate = require("../lib/youtubeFormatList");

router.get("/", (req, res) => {
  res.sendFile(resolve("./views/index.html"));
});

router.get("/view", async (req, res) => {
  const { url } = req.query;
  const id = extractVideoId(url);
  if (!id) {
    res.send(`
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <h1>올바른 링크가 아닙니다</h1>`);
    return;
  }

  const bitrate = await getAudioBitrate(id);
  if (!bitrate) {
    res.render("../views/view.ejs", { bitrate: "ERROR PLEASE TRY AGAIN", id });
    return;
  }
  res.render("../views/view.ejs", { bitrate, id });
});

module.exports = router;

function extractVideoId(url) {
  const regex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
  const match = regex.exec(url);
  if (match && match[7].length === 11) {
    return match[7];
  }
  return false;
}
