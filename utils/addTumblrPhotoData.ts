import axios from 'axios';
import tumblr from 'tumblr.js';
import { supabase, SUPABASE_URL } from "../supabase";
import { getImageLabels } from "./getImageLabels";
import { getImageText } from "./getImageText";

interface Photo {
    filename: string;
    tags: string;
    url: string;
    date: number;
    timestamp: number;
    tumblr_post_url: string;
}

interface TumblrResponse {
    err: any;
    resp: {
        posts: any[];
        total_posts: number;
    }
}

const client = tumblr.createClient({
    consumer_key: process.env.TUMBLR_CONSUMER,
    consumer_secret: process.env.TUMBLR_SECRET,
    token: process.env.TUMBLR_TOKEN,
    token_secret: process.env.TUMBLR_TOKEN_SECRET
});

async function uploadFileToBucket(photo: Photo, fileData: ArrayBuffer) {
    const { data, error } = await supabase
        .storage
        .from("positivedoodles")
        .upload(photo.filename, fileData, {
            contentType: 'image/png'
        });
    if (error) {
        console.log("Error uploading file to bucket", error);
        process.exit(1);
    }
    console.log("Success uploading file to bucket", data);
}

async function addToDatabase(photo: Photo, fileData: Buffer) {
    let [processedText, processedLabels] = await Promise.all([getImageText(fileData), getImageLabels(fileData)]);
    const created_at = new Date(photo.date);
    const { error } = await supabase
        .from("positive_doodles")
        .insert({
            url: `${SUPABASE_URL}/storage/v1/object/public/positivedoodles/${photo.filename}`,
            file_name: photo.filename,
            tags: photo.tags,
            category: "",
            image_text: processedText.image_text,
            word_map: processedText.word_map,
            notes: "",
            labels: processedLabels,
            created_at: created_at,
            tumblr_post_url: photo.tumblr_post_url,
            tumblr_image_url: photo.url
        })
    if (error) {
        console.log("Error!", error);
        process.exit(1);
    }
    console.log("Success adding to database!");
}

function getBlogPosts(offset: number): Promise<TumblrResponse> {
    return new Promise(resolve => {
        client.blogPosts('positivedoodles', { type: 'photo', offset, tag: ["doodles", "doodle"] }, function (err, resp) {
            resolve({ err, resp });
        })
    })
}

export async function getTumblrImages(offset: number = 0) {
    const { err, resp } = await getBlogPosts(offset);
    if (err) {
        console.error(err);
        return;
    }
    if (resp && resp.posts) {
        const photos: Photo[] = [];
        for (const post of resp.posts) {
            let photoCounter = 0;
            for (const photo of post.photos) {
                photos.push({
                    filename: `tumblr_${post.id}_${photoCounter}.png`,
                    tags: post.tags.join(","),
                    url: photo.original_size.url,
                    date: post.date,
                    timestamp: post.timestamp,
                    tumblr_post_url: post.short_url
                });
                photoCounter++;
            }
        }

        for (const photo of photos) {
            const response = await axios.get(photo.url, { responseType: 'arraybuffer' });
            const fileData = response.data;
            await uploadFileToBucket(photo, fileData);
            await addToDatabase(photo, fileData);
        }
        if (resp.total_posts > offset + resp.posts.length) {
            await getTumblrImages(offset + resp.posts.length);
        }
    }
}