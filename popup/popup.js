const start = document.querySelector("#start");
const stop = document.querySelector("#stop");

chrome.storage.sync.get("tunedIn", (result) => {
  console.log("TunedIn currently is " + result.tunedIn);
  if (result.tunedIn) {
    start.style.display = "none";
    stop.style.display = "inline";
  } else {
    stop.style.display = "none";
    start.style.display = "inline";
  }
});

start.onclick = () => {
  start.style.display = "none";
  stop.style.display = "inline";
  chrome.storage.sync.set({ tunedIn: true }, function () {
    console.log("TunedIn is set to " + true);
  });
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

stop.onclick = () => {
  stop.style.display = "none";
  start.style.display = "inline";
  chrome.storage.sync.set({ tunedIn: false }, function () {
    console.log("TunedIn is set to " + false);
  });
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
