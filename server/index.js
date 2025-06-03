const express = require("express");
const admin = require("firebase-admin");
const { getMessaging } = require("firebase-admin/messaging");
const cors = require("cors");
const app = express();
const serviceAccount = require("./gdud-erez-firebase-adminsdk-fbsvc-cb10bcc607.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://gdud-erez-default-rtdb.europe-west1.firebasedatabase.app",
});

app.use(cors());
app.use(express.json());

const path = __dirname + "/views/";
app.use(express.static(path));

app.get("/", (req, res) => {
  res.sendFile(path + "index.html");
});

app.post("/subscribe/:topic", (req, res) => {
  try {
    getMessaging().subscribeToTopic(req.body.token, req.params.topic);
  } catch (err) {
    console.log(err);
  }
});

app.post("/unsubscribe/:topic", (req, res) => {
  try {
    getMessaging().unsubscribeFromTopic(req.body.token, req.params.topic);
  } catch (err) {
    console.log(err);
  }
});

app.post("/change-subscription/:topicFrom/:topicTo", async (req, res) => {
  try {
    await getMessaging().unsubscribeFromTopic(
      req.body.token,
      req.params.topicFrom
    );
    await getMessaging().subscribeToTopic(req.body.token, req.params.topicTo);
  } catch (err) {
    console.log(err);
  }
});

app.post("/send-topic", async (req, res) => {
  try {
    await getMessaging().send(req.body.message);
  } catch (err) {
    console.log(err);
  }
});

app.post("/send-group", async (req, res) => {
  try {
    await getMessaging().sendEachForMulticast(req.body.message);
  } catch (err) {
    console.log(err);
  }
});

app.listen(3000, function () {
  console.log("listening on port 3000");
});
