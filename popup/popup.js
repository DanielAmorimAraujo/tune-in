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

// Notification testing
const button = document.createElement("button");
button.textContent = "Greet me!";
document.body.insertAdjacentElement("afterbegin", button);

const button2 = document.createElement("button");
button2.textContent = "Hello";
document.body.insertAdjacentElement("afterbegin", button2);

button.addEventListener("click", () => {
  chrome.runtime.sendMessage("", {
    type: "notification",
    options: {
      title: "Just wanted to notify you",
      message: "How great it is!",
      iconUrl: "elephant.png",
      type: "basic",
    },
  });
});

button2.addEventListener("click", () => {
  chrome.runtime.sendMessage("", {
    type: "notification",
    options: {
      title: "YOOOOOO",
      message: "How great it is!",
      iconUrl: "elephant.png",
      type: "basic",
    },
  });
});
