const { client } = require("../vision.js")

async function getImageText(filename) {
    const [result] = await client.documentTextDetection(filename).catch(err => {
        console.log("Error getting image text: ", img);
    });
    const detections = result.textAnnotations;
    const processedDetections = processWordDetection(detections);
    return processedDetections;
}

function processWordDetection(detections) {
    if (!detections || !detections[0]) return {};
    //remove line indents
    const image_text = detections[0].description.replace(/(\r\n|\n|\r)/gm, " ");

    //convert to lowercase and remove artist name
    let cleaned_text = image_text.toLowerCase();
    cleaned_text = cleaned_text.replace("emm", "").replace("roy", "");

    //remove punctuation and cleanup spaces
    cleaned_text = cleaned_text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~'()]/g, "");
    cleaned_text = cleaned_text.replace(/\s{2,}/g, " ");
    cleaned_text = cleaned_text.trim();

    const split_text = cleaned_text.split(" ");
    const word_map = getWordMap(split_text);

    return {
        image_text,
        word_map
    };
}

function getWordMap(split_text) {
    const word_map = {};
    split_text.forEach(word => {
        if (!word_map[word]) {
            word_map[word] = 1;
        } else {
            word_map[word] += 1;
        }
    })
    return word_map;
}

module.exports = {
    getImageText
};
