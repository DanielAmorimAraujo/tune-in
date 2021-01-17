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
  if (request.msg == "startFunc") {
    listenWord();
  }
  if (request.msg === "stopFunc") stop();
});

const start = () => {};

const stop = () => {};

// :D
let recognizer;
let trainerDict = ["Spawn", "Go", "Left"];
const OVERLAP_FACTOR = 0.25;

async function app() {
  recognizer = speechCommands.create("BROWSER_FFT");
  await recognizer.ensureModelLoaded();
  // buildModel();
}

app();

const NUM_FRAMES = 43;

const INPUT_SHAPE = [NUM_FRAMES, 232, 1];
let model;

async function loadModel() {
  model = await tf.loadLayersModel(
    "https://storage.googleapis.com/tune-in/my-model.json"
  );
}

loadModel();

/* function buildModel() {
  model = tf.sequential();
  model.add(
    tf.layers.depthwiseConv2d({
      depthMultiplier: 8,
      kernelSize: [NUM_FRAMES, 3],
      activation: "relu",
      inputShape: INPUT_SHAPE,
    })
  );
  model.add(tf.layers.maxPooling2d({ poolSize: [1, 2], strides: [2, 2] }));
  model.add(tf.layers.flatten());
  model.add(tf.layers.dense({ units: 3, activation: "softmax" }));
  const optimizer = tf.train.adam(0.01);
  model.compile({
    optimizer,
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"],
  });
} */

function listenWord() {
  console.log("listenword");
  if (recognizer.isListening()) {
    recognizer.stopListening();
    return;
  }

  recognizer.listen(
    async ({ scores, spectrogram: { frameSize, data } }) => {
      const vals = normalize(data.subarray(-frameSize * NUM_FRAMES));
      const input = tf.tensor(vals, [1, ...INPUT_SHAPE]);
      const probs = model.predict(input);
      const predLabel = probs.argMax(1);
      const winningNum = (await predLabel.data())[0];
      console.log(winningNum);
      if (winningNum !== 2) {
        chrome.runtime.sendMessage("", {
          type: "notification",
          options: {
            title: trainerDict[winningNum],
            message: "",
            iconUrl: "elephant.png",
            type: "basic",
          },
        });
      }
      tf.dispose([input, probs, predLabel]);
    },
    {
      overlapFactor: OVERLAP_FACTOR,
      includeSpectrogram: true,
      invokeCallbackOnNoiseAndUnknown: true,
    }
  );
}

chrome.runtime.onMessage.addListener((data) => {
  var msgID = Math.random();
  var n = msgID.toString();
  if (data.type === "notification") {
    chrome.notifications.create(n, data.options);
  }
});
