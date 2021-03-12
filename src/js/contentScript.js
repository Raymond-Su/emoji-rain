import { EMOJI_UNICODE } from "./data";

const RAINIT_MAX_DROPS = 100;
const AG = 9.81; // Acceleration of gravity

const rainEngineCSS = {
  position: "fixed",
  background: "transparent",
  overflow: "hidden",
  visibility: "hidden",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  margin: 0,
  padding: 0,
};

/**
 * Class representing a raindrop
 */
class RainDrop {
  /**
   * creates a raindrop
   * @param {string} emoji - emoji char to display as the raindrop
   * @param {number} maxHeight - raindrop initial position 0~max height
   * @param {number} maxWidth - raindrop initial position 0~max width
   */
  constructor(emoji, maxHeight, maxWidth) {
    this.text = emoji;
    this.x = Math.random() * maxWidth;
    this.y = Math.random() * maxHeight;
    this.vx = 0;
    this.vy = AG;
    this.font = "14px serif";
  }

  /**
   * draw the raindrop with this.text
   * @param {CanvasRenderingContext2D} ctx - canvas 2d context
   */
  drawDrop(ctx) {
    ctx.font = this.font;
    ctx.fillText(this.text, this.x, this.y);
  }

  move(maxHeight, maxWidth) {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x > maxWidth || this.y > maxHeight) {
      // over the visible boundary, paint the raindrop from anywhere again
      this.x = Math.random() * maxWidth;
      this.y = -20;
    }
  }
}

/**
 * Class representing a rain canvas
 */
class RainEngine {
  constructor() {
    this.canvas = this.getOrCreateCanvas();
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx = this.canvas.getContext("2d");
    this.rainLoopId = null;
  }

  /**
   * @return {HTMLCanvasElement} - canvas element
   * get cavas by id or create the canvas
   */
  getOrCreateCanvas() {
    if (document.getElementById("rain-engine")) {
      return document.getElementById("rain-engine");
    }
    const canvas = document.createElement("canvas");
    canvas.id = "rain-engine";
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    canvas.style.cssText = Object.entries(rainEngineCSS).reduce((arr, css) => `${arr} ${css[0]}: ${css[1]};`, "");
    document.body.appendChild(canvas);
    return canvas;
  }

  /**
   * @param {string} - emoji char code
   * @return {string} - the emoji char for a codepoint.
   *
   * copy from https://github.com/notwaldorf/emoji-rain
   * lifted from https://github.com/twitter/twemoji
   */
  getEmojiFromCodePoint(codePoint) {
    let code = typeof codePoint === "string" ? parseInt(codePoint, 16) : codePoint;
    if (code < 0x10000) {
      return String.fromCharCode(code);
    }
    code -= 0x10000;
    return String.fromCharCode(0xd800 + (code >> 10), 0xdc00 + (code & 0x3ff));
  }

  /**
   * @param {string} - emoji unicode
   * @param {boolean} - random
   * @return {RainDrop[]} - array of raindrops, num is maxDrops
   */
  generateEmojiDrops(emojiUnicode, random) {
    const rainDrops = [];
    for (let i = 0; i < RAINIT_MAX_DROPS; i++) {
      const emoji = this.getEmojiFromCodePoint(
        random ? EMOJI_UNICODE[Math.floor(Math.random() * EMOJI_UNICODE.length)] : emojiUnicode
      );
      rainDrops.push(new RainDrop(emoji, this.canvas.height, this.canvas.width));
    }
    return rainDrops;
  }

  drawRain(rainDrops) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let i = 0; i < RAINIT_MAX_DROPS; i++) {
      rainDrops[i].drawDrop(this.ctx);
      rainDrops[i].move(this.canvas.height, this.canvas.width);
    }
  }

  resize() {
    this.canvas.height = window.innerHeight;
    this.canvas.width = window.innerWidth;
  }

  start(rainDrops) {
    this.canvas.style.visibility = "visible";
    this.rainLoopId = setInterval(this.drawRain.bind(this), 50, rainDrops);
  }

  stop() {
    clearInterval(this.rainLoopId);
    this.rainLoopId = null;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.canvas.style.visibility = "hidden";
  }
}

(function setup() {
  const rainEngine = new RainEngine();
  window.addEventListener("resize", () => rainEngine.resize());

  chrome.runtime.onMessage.addListener((message, sender, callback) => {
    const { type, payload } = message;
    if (type == "TOGGLE_RAIN") {
      const randomEmojis = payload == "RANDOM";
      const rainDrops = rainEngine.generateEmojiDrops(payload, randomEmojis);
      rainEngine.start(rainDrops);
    } else if (type == "TOGGLE_RAIN_OFF") {
      rainEngine.stop();
    }
  });
})();
