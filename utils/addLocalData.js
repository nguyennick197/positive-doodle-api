const fs = require('fs');
const path = require('path');
const { decode } = require('base64-arraybuffer')
const { supabase, SUPABASE_URL } = require("../supabase.js");
const { getImageLabels } = require("./getImageLabels")
const { getImageText } = require("./getImageText")


async function uploadFileToBucket(filePath, file) {
    const base64FileData = fs.readFileSync(filePath, { encoding: 'base64' })
    const { data, error } = await supabase
        .storage
        .from("doodles")
        .upload(file, decode(base64FileData), {
            contentType: 'image/png'
        })
    if (error) {
        console.log("Error uploading file to bucket", error)
        process.exit(1)
    }
    console.log("Success uploading file to bucket", data)
}

async function addToDatabase(filePath, file, category) {
    let [processedText, processedLabels] = await Promise.all([getImageText(filePath), getImageLabels(filePath)])

    const { error } = await supabase
        .from("doodles")
        .insert({
            url: `${SUPABASE_URL}/storage/v1/object/public/doodles/${file}`,
            file_name: file,
            tags: "",
            category: category,
            image_text: processedText.image_text,
            word_map: processedText.word_map,
            notes: "",
            labels: processedLabels
        })
    if (error) {
        console.log("Error!", error)
        process.exit(1)
    }
    console.log("Success!")
}

async function moveFileToProcessedFolder(filePath, file, category) {
    const moveTo = path.join("./processed_imgs", file)
    fs.rename(filePath, moveTo, (err) => {
        if (err) {
            throw err
        } else {
            console.log("Successfully moved the file!");
        }
    });
}

async function addLocalData(folderPath) {
    const files = fs.readdirSync(folderPath)
    const category = path.basename(folderPath)
    for (const file of files) {
        console.log("Adding: ", file)
        const filePath = path.join(folderPath, file)

        await uploadFileToBucket(filePath, file).catch(err => {
            console.error(err);
            process.exit(1);
        })

        await addToDatabase(filePath, file, category).catch(err => {
            console.error(err);
            process.exit(1);
        })

        moveFileToProcessedFolder(filePath, file, category)
    }
}

module.exports = {
    addLocalData,
}