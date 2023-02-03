import { client } from "../vision";

export async function getImageText(filename: Buffer) {
    const [result]: any = await client.documentTextDetection(filename).catch(err => {
        console.log("Error getting image text: ", filename, err);
    });
    const detections = result.textAnnotations;
    const processedDetections = processWordDetection(detections);
    return processedDetections;
}

function processWordDetection(detections: any[]) {
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

interface WordMap {
    [word: string]: number;
}

function getWordMap(split_text: string[]): WordMap {
    const word_map: WordMap = {};
    split_text.forEach(word => {
        if (!word_map[word]) {
            word_map[word] = 1;
        } else {
            word_map[word] += 1;
        }
    })
    return word_map;
}
