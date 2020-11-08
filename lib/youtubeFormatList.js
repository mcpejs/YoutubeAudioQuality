const request = require("request-promise");

const cache = {};

const getAudioBitrate = async (id) => {
  if (id in cache) return cache[id];
  const target = `https://www.youtube.com/watch?v=${id}&gl=US&hl=en&has_verified=1&bpctr=9999999999&disable_polymer=true`;
  const body = await request(target);
  const lastAudioIndex = body.lastIndexOf("audio\\");
  const bitrateKeyIndex = body.indexOf("bitrate", lastAudioIndex);
  const startIndex = body.indexOf(":", bitrateKeyIndex) + 1;
  const endIndex = body.indexOf(",", bitrateKeyIndex);
  const bestAudioBitrate = body.slice(startIndex, endIndex);

  if (!bestAudioBitrate) return;

  cache[id] = bestAudioBitrate;
  return bestAudioBitrate;
};

module.exports = getAudioBitrate;

if (typeof module !== "undefined" && !module.parent) {
  getAudioBitrate("YMgFEl5h8nI").then(console.log);
}
