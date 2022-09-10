const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/route');
const mongoose = require('mongoose');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://HarshalJamdar:810Umakant@cluster0.wz2ii.mongodb.net/Reunion", {
    usenewurlParser: true
})
    .then(() => console.log("MongoDb is connected..."))
    .catch(error => console.log(error));

app.use("/", route);

app.listen(process.env.PORT || 5000, function () {
    console.log("Express app running on port " + (process.env.PORT || 5000))
});