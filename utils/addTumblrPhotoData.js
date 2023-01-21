const axios = require('axios');
const tumblr = require('tumblr.js');
const { supabase, SUPABASE_URL } = require("../supabase.js");
const { getImageLabels } = require("./getImageLabels");
const { getImageText } = require("./getImageText");

const client = tumblr.createClient({
    consumer_key: process.env.TUMBLR_CONSUMER,
    consumer_secret: process.env.TUMBLR_SECRET,
    token: process.env.TUMBLR_TOKEN,
    token_secret: process.env.TUMBLR_TOKEN_SECRET
});

async function uploadFileToBucket(photo, fileData) {
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

async function addToDatabase(photo, fileData) {
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

async function getTumblrImages(offset = 0) {
    client.blogPosts('positivedoodles', { type: 'photo', offset, tag: ["doodles", "doodle"]}, async function (err, resp) {
        if (err) {
            console.log(err);
            return;
        }
        console.log("Offset: ", offset);
        if (resp && resp.posts) {
            const photos = [];
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
    });
}

async function main() {
    await getTumblrImages(0);
}

main();