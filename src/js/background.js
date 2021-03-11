try {
  chrome.runtime.onInstalled.addListener(() => {
    console.log("Background page loaded");
  });

  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(request);
    if (request.type === "TOGGLE_RAIN") {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
        chrome.storage.local.get([`toggle-rain-${tab[0].id}`], (results) => {
          // store new swapped setting
          const tabToggle = !results[`toggle-rain-${tab[0].id}`];
          chrome.storage.local.set({
            [`toggle-rain-${tab[0].id}`]: tabToggle,
          });

          if (tabToggle) {
            chrome.tabs.sendMessage(tab[0].id, { type: "TOGGLE_RAIN", payload: request.payload });
          } else {
            chrome.tabs.sendMessage(tab[0].id, { type: "TOGGLE_RAIN_OFF", payload: request.payload });
          }
        });
      });
    }
  });
} catch (e) {
  console.error(e);
  chrome.storage.local.clear(function () {
    var error = chrome.runtime.lastError;
    if (error) {
      console.error(error);
    }
  });
}
