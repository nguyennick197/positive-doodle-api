# Positive Doodle API

This API provides access drawings from the positivedoodles tumblr, drawn by Emm Roy. Drawings are not allowed to be used for profit. Documentation on how to consume the API is provided below.

## Emm Roy's socials
 - [Patreon](https://www.patreon.com/emmnotemma)
 - [Twitter](https://twitter.com/emmnotemma)
 - [Tumblr](https://positivedoodles.tumblr.com/)

# Endpoints

## Get all doodles        

`GET /doodles`

Retrieves all doodles, paginated.

### Query parameters

- `page`: The page number to retrieve. Default is 1.
- `per_page`: The number of rows to retrieve per page. Default is 20.
- `order`: The order to retrieve the doodles in by id, descending or ascending. Default is ascending.
- `file_name`: Filter doodles by file_name. Default is none.
- `tag`: Filter doodles by tag. Default is none.
- `search`: Filters doodles by image text and tags. Default is none.

## Example

`$ curl https://api.nicknguyencodes.com/doodles?page=2&per_page=5&order=descending&search=cat`

---

## Get a doodle by ID

`GET /doodles/:id`

Retrieves a specific doodle by its ID.

### Path parameters

- `id`: The ID of the doodle to retrieve.

### Example

`$ curl https://api.nicknguyencodes.com/doodles/:id`

---

## Get a random doodle

`GET /doodles/random`

Retrieves a random doodle.

### Query parameters

- `tag`: The tag of doodle to retrieve. Default is none.
- `search`: Filters doodles by image text and tag. Default is none.
- `file_name`: Filter doodles by file_name. Default is none.

### Example

`$ curl https://api.nicknguyencodes.com/doodles/random?tags=cat`

---

## Get all doodle tags

`GET /doodles/tags`

Retrieves a list of all possible tags for a doodle.

### Query parameters

- `page`: The page number to retrieve. Default is 1.
- `per_page`: The number of rows to retrieve per page. Default is 40.

### Example

`$ curl https://api.nicknguyencodes.com/doodles/tags`

---

## Response format

All responses are in JSON format.

If the request is for multiple rows such as `/doodles` or `doodles/tags`, the request will have the following fields:

- `data`: an array containing all of the returned rows
- `total_items`: an integer with the count of all items from that table after the filters are applied

If the request is for a single item such as `/doodles/:id` or `/doodles/random`, the return item will be a single object with the following fields:

- `id`: integer with the row's database id 
- `url`: string that contains the url to the corresponding image
- `created_at`: string that contains the date the image was posted to the tumblr blog
- `tags`: string that contains comma separated tags 
- `image_text`: string that contains text from the image

## Built With
 - [Supabase](https://supabase.com/)
 - [Node](https://nodejs.org/en/)
 - [Express](https://expressjs.com/)
 - [Cloud Vision AI](https://cloud.google.com/vision)

## Contributors 
 - [Nick Nguyen](https://github.com/nguyennick197)


