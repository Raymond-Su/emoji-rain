import "../css/popup.css";
import { EMOJI_UNICODE } from "./data";

let lastEmoji = "";

function handleEmojiButtonClick(emoji) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
    chrome.tabs.sendMessage(tab[0].id, { type: "TOGGLE_RAIN_OFF" });
    if (lastEmoji != emoji) {
      chrome.tabs.sendMessage(tab[0].id, { type: "TOGGLE_RAIN", payload: emoji });
    }

    lastEmoji = lastEmoji == emoji ? "" : emoji;
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const emojiContainer = document.getElementById("emojis");
  const randomEmojiBtn = document.getElementById("random-btn");

  for (const emoji of EMOJI_UNICODE) {
    const emojiButton = document.createElement("button");
    emojiButton.addEventListener("click", () => handleEmojiButtonClick(emoji));
    emojiButton.innerHTML = `&#x${emoji.split(" ")[0]};`;
    emojiButton.className = "emoji-btn";

    emojiContainer.appendChild(emojiButton);
  }

  randomEmojiBtn.addEventListener("click", () => handleEmojiButtonClick("RANDOM"));
});
