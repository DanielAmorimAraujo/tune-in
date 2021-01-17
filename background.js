var pageConditions = {
  conditions: [
    new chrome.declarativeContent.PageStateMatcher({
      pageUrl: { schemes: ["https", "http"] },
    }),
  ],
  actions: [new chrome.declarativeContent.ShowPageAction()],
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([pageConditions]);
  });

  chrome.tabs.create({
    url: chrome.extension.getURL("home.html"),
    active: true,
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.msg === "startFunc") start();
  if (request.msg === "stopFunc") stop();
});

const start = () => {
  listenWord();
};

const stop = () => {
  if (recognizer.isListening()) {
    recognizer.stopListening();
  }
};

const URL = "https://teachablemachine.withgoogle.com/models/Bwdqb0srT/";
const checkpointURL = URL + "model.json"; // Model Topology
const metadataURL = URL + "metadata.json"; // Model Metadata

let recognizer;

async function app() {
  recognizer = speechCommands.create(
    "BROWSER_FFT",
    undefined,
    checkpointURL,
    metadataURL
  );
  await recognizer.ensureModelLoaded();
}

app();

// let buffer = [];
// const MESSAGE_LENGTH = 2;

function listenWord() {
  if (recognizer.isListening()) {
    recognizer.stopListening();
    return;
  }

  const classLabels = recognizer.wordLabels();

  recognizer.listen(
    (result) => {
      const scores = result.scores; // Probability of prediction for each class
      // Render the probability scores per class

      let max = 0;
      let indexMax = 0;

      for (let i = 0; i < classLabels.length; i++) {
        if (scores[i] > max) {
          max = scores[i];
          indexMax = i;
        }
      }

      // Debugging
      console.log(classLabels);
      console.log(classLabels[indexMax]);

      if (classLabels[indexMax] !== "Background Noise") {
        var messageId = Math.random();
        var messageIdStr = messageId.toString();

        // buffer.push(classLabels[indexMax]);

        // if (buffer.length >= MESSAGE_LENGTH) {
        // let notification = buffer.join(" ");
        let notification = classLabels[indexMax];

        chrome.notifications.create(messageIdStr, {
          title: notification,
          message: "",
          iconUrl: "logo.png",
          type: "basic",
          requireInteraction: true,
        });

        // buffer = [];
        // }
      }
    },
    {
      includeSpectrogram: true, // In case listen should return result.spectrogram
      probabilityThreshold: 0.75,
      invokeCallbackOnNoiseAndUnknown: true,
      overlapFactor: 0.5, // Probably want between 0.5 and 0.75. More info in README
    }
  );
}
