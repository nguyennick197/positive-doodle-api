import { supabase } from "../supabase";
import axios from "axios";
import sharp from "sharp";
import PNG from "pngjs";

const png = PNG.PNG;

async function getImages(page: number, perPage: number) {
    const offset = (page - 1) * perPage
    const rangeEnd = offset + perPage - 1;

    const { data, error } = await supabase
        .from("positive_doodles")
        .select('id, tumblr_image_url')
        .range(offset, rangeEnd)
        .order('id', { ascending: true });

    if (error) return null;
    return data;
}

function getColorFromBuffer(buffer: Buffer) {
    const { data } = png.sync.read(buffer);
    return [data[0], data[1], data[2]];
}

async function getColors(url: string, id: number) {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const fileData = response.data;
        const buffer = await sharp(fileData)
            .extract({ left: 10, top: 10, width: 20, height: 20 })
            .toBuffer()
        const colors = getColorFromBuffer(buffer);
        return {
            colors,
            id
        };
    } catch (err) {
        console.log("Error getting bg color for ", id, err);
        return {
            colors: null,
            id
        }
    }
}

async function main() {
    for (let i = 4; i < 20; i++) {
        const images = await getImages(i, 100);
        if (!images) return;
        const promises = [];
        for (const image of images) {
            promises.push(getColors(image.tumblr_image_url, image.id));
        }
        const allPromises = await Promise.all(promises);
        for (const colorItem of allPromises) {
            const { id, colors } = colorItem;
            const { error } = await supabase
                .from("positive_doodles")
                .update({ background_color: colors })
                .eq("id", id);
            if (error) {
                console.log(id, colors, error);
                continue;
            }
            console.log("Successfully added background color ", id, colors);
        }
    }
}

main()

