function filterQuery(supabaseQuery, reqQuery) {
    const tag = reqQuery.tag;
    const search = reqQuery.search;
    const file_name = reqQuery.file_name;

    if (tag) {
        supabaseQuery.ilike('tags', `%${tag}%`);
    }

    if (search) {
        let searchString = search.toLowerCase().split(" ").join(" | ");
        supabaseQuery.textSearch('fts', searchString);
    }

    if (file_name) {
       supabaseQuery.eq("file_name", file_name);
    }
}

module.exports = {
    filterQuery
}