const { client } = require("../vision.js")

async function getImageText(filename) {
    const [result] = await client.documentTextDetection(filename).catch(err => {
        console.log("Error getting image text: ", img)
        
    });
    const detections = result.textAnnotations;
    const processedDetections = processWordDetection(detections)
    return processedDetections;
}

function processWordDetection(detections) {
    if (!detections || !detections[0]) return {};
    //remove line indents
    const image_text = detections[0].description.replace(/(\r\n|\n|\r)/gm, " ");
    console.log(image_text)

    //convert to lowercase and remove artist name
    let cleaned_text = image_text.toLowerCase()
    cleaned_text = cleaned_text.replace("emm", "").replace("roy", "")

    //remove punctuation and cleanup spaces
    cleaned_text = cleaned_text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~'()]/g, "")
    cleaned_text = cleaned_text.replace(/\s{2,}/g, " ")
    cleaned_text = cleaned_text.trim()

    const split_text = cleaned_text.split(" ")
    const word_map = getWordMap(split_text)

    return {
        image_text,
        word_map
    }
}

function getWordMap(split_text) {
    const word_map = {}
    const word_value = +((1 / split_text.length).toFixed(2))
    split_text.forEach(word => {
        if (!word_map[word]) {
            word_map[word] = word_value
        } else {
            word_map[word] += word_value
            // handle floating point number precision
            word_map[word] = +(word_map[word].toFixed(2))
        }
    })
    console.log(word_map)
    return word_map
}

module.exports = {
    getImageText
};
