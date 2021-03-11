import "../css/popup.css";
import { RAINIT_EMOJI_CODE } from "./data";

document.addEventListener("DOMContentLoaded", function () {
  const emojiContainer = document.getElementById("emojis");

  for (const emoji of RAINIT_EMOJI_CODE) {
    const emojiButton = document.createElement("button");
    emojiButton.addEventListener("click", () => chrome.runtime.sendMessage({ type: "TOGGLE_RAIN", payload: emoji }));
    emojiButton.innerHTML = `&#x${emoji.split(" ")[0]};`;
    emojiButton.className = "emoji-button";

    emojiContainer.appendChild(emojiButton);
  }
});
