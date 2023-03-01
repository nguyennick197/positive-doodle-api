import { Doodle } from "./types";
import { supabase } from "../supabase";
import { fieldsToGet } from "../routes/doodles";

const tagsToRemove = ["doodles", "doodle"];

//to do: add sentiment analysis of image_text to database and filter by sentiment as well
export const getSimilarDoodles = async (doodle: Doodle, count: number) => {
    const { id, tags } = doodle;

    const tagArr = tags!.split(",");
    const filteredTags = tagArr.filter(tag => !tagsToRemove.includes(tag));
    const randomTag = filteredTags[Math.floor(Math.random() * filteredTags.length)];

    const { data, error } = await supabase
        .from("positive_doodles")
        .select(fieldsToGet)
        .neq('id', id)
        .limit(count)
        .ilike('tags', `%${randomTag}%`)

    if (error) return [];

    return data;
};