import { client } from "../vision";

interface LabelMap {
    [description: string]: number;
}

interface Label {
    description?: (string|null);
    score?: (number|null);
}

export async function getImageLabels(filePath: Buffer): Promise<LabelMap>  {
    const [result] = await client.labelDetection(filePath);
    const labels = result.labelAnnotations;
    const label_map: LabelMap = {};
    labels!.forEach((label: Label) => {
        if (label.description && label.score){
            label_map[label.description] = label.score;
        }
    });
    return label_map;
}