const start = document.querySelector("#start");
const stop = document.querySelector("#stop");

start.onclick = function () {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    (tabs) => {
      chrome.runtime.sendMessage({ msg: "startFunc" });
    }
  );
};

stop.onclick = function () {
  chrome.tabs.query(
    {
      active: true,
      lastFocusedWindow: true,
    },
    (tabs) => {
      chrome.runtime.sendMessage({ msg: "stopFunc" });
    }
  );
};
