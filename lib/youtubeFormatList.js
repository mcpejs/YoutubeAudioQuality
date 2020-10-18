const request = require("request-promise");
const execa = require("execa");
const cache = {};

const getFormatList = (url) =>
  new Promise(async (resolve, reject) => {
    const { stdout } = await execa("youtube-dl.exe", ["-F", url]);
    const temp = stdout.split("\n");
    resolve(
      temp.slice(
        temp.indexOf("format code  extension  resolution note") + 1,
        temp.length
      )
    );
  });

const getAudioBitrate = async (id) => {
  if (id in cache) return cache[id];
  const target = `https://youtu.be/${id}`;
  const formatList = await getFormatList(target);
  let bestAudioOnlyFormat;
  for (let i = 0; i < formatList.length; i++) {
    const format = formatList[i];
    if (!format.includes("audio")) {
      bestAudioOnlyFormat = formatList[i - 1];
      break;
    }
  }
  const kIndex = bestAudioOnlyFormat.indexOf("k");
  for (let i = kIndex - 1; ; i--) {
    if (bestAudioOnlyFormat[i] == " ") {
      const bestAudioBitrate = bestAudioOnlyFormat.slice(i + 1, kIndex);
      cache[id] = bestAudioBitrate;
      console.log(cache);
      return bestAudioBitrate;
    }
  }
};

module.exports = getAudioBitrate;

if (typeof module !== "undefined" && !module.parent) {
  getAudioBitrate("YMgFEl5h8nI").then(console.log);
}
