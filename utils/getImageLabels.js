const { client } = require("../vision.js")

async function getImageLabels(filePath) {
    const [result] = await client.labelDetection(filePath);
    const labels = result.labelAnnotations;
    const label_map = {};
    labels.forEach(label => {
        label_map[label.description] = label.score;
    });
    return label_map;
}

module.exports = {
    getImageLabels
};