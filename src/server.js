const app = require("./app");
const connectDb = require("./config/db");
const { serverPort } = require("./secret");

app.listen(serverPort, async () => {
  console.log(`http://localhost:${serverPort}`);
  await connectDb();
});
