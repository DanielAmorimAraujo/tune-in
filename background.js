var pageConditions = {
  conditions: [
    new chrome.declarativeContent.PageStateMatcher({
      pageUrl: { schemes: ["https", "http"] },
    }),
  ],
  actions: [new chrome.declarativeContent.ShowPageAction()],
};

chrome.runtime.onInstalled.addListener(function () {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([pageConditions]);
  });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.msg == "startFunc") start();
  if (request.msg === "stopFunc") stop();
});

const start = () => {};

const stop = () => {};

// Notification testing
chrome.runtime.onMessage.addListener((data) => {
  var msgID = Math.random();
  var n = msgID.toString();
  if (data.type === "notification") {
    chrome.notifications.create(n, data.options);
  }
  console.log(n);
});
