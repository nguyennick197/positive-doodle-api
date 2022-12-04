const vision = require("@google-cloud/vision");
require('dotenv').config()

const client = new vision.ImageAnnotatorClient()

module.exports = {
    client
};