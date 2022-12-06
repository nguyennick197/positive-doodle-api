const { supabase } = require("../supabase.js");

async function doesCategoryExist(category) {
    const { data, error } = await supabase
        .from("categories")
        .select();

    if (!data) return false;

    const categories = data.map(catObj => catObj.category);

    if (categories.includes(category)) return true;

    return false;
}

module.exports = {
    doesCategoryExist
}