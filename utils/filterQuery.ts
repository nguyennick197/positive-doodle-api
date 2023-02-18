import { PostgrestFilterBuilder, PostgrestSingleResponse } from "@supabase/postgrest-js";

interface RequestQuery {
    tag?: string;
    search?: string;
    file_name?: string;
    ids?: string
}

export function filterQuery(
    supabaseQuery: PostgrestFilterBuilder<any, any, any>,
    reqQuery: RequestQuery
) {
    const tag = reqQuery.tag;
    const search = reqQuery.search;
    const file_name = reqQuery.file_name;
    const ids = reqQuery.ids;

    if (tag) {
        supabaseQuery.ilike('tags', `%${tag}%`);
    }

    if (search) {
        let searchString = search.toLowerCase().split(" ").join(" | ");
        (supabaseQuery as PostgrestFilterBuilder<any, any, any>).textSearch('fts', searchString);
    }

    if (file_name) {
       supabaseQuery.eq("file_name", file_name);
    }

    if (ids) {
        const idArr = ids.split(',');
        const numArr = idArr.map(id => parseInt(id));
        supabaseQuery.in('id', numArr);
    }
}