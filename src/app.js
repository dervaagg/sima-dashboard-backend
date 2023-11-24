require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 4001;
const router = require("./routes/index");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(cors());

app.use(express.static("public"));
app.use("/", router);

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});
