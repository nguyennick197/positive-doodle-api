# Positive Doodle API

This API provides access drawings from the positivedoodles tumblr, created by Emm Roy. Drawings are not allowed to be used for profit. Documentation on how to consume the API is provided below.

## Emm Roy's socials
 - [Patreon](https://www.patreon.com/emmnotemma)
 - [Twitter](https://twitter.com/emmnotemma)
 - [Tumblr](https://positivedoodles.tumblr.com/)

## Built With
 - [Supabase](https://supabase.com/)
 - [Node](https://nodejs.org/en/)
 - [Express](https://expressjs.com/)
 - [Cloud Vision AI](https://cloud.google.com/vision)

## Contributors 
 - [Nick Nguyen](https://github.com/nguyennick197)

---

# Endpoints

## Get all doodles        

`GET /doodles`

Retrieves all doodles, paginated.

### Query parameters

- `page`: The page number to retrieve. Default is 1.
- `per_page`: The number of rows to retrieve per page. Default is 20.

## Example

`$ curl https://api.nicknguyencodes.com/doodles?page=2&per_page=5`

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

- `category`: The category of doodle to retrieve. Default is null.

### Example

`$ curl https://api.nicknguyencodes.com/doodles/random?category=cat`

---

## Get all doodle categories

`GET /doodles/categories`

Retrieves a list of all possible categories for a doodle.

### Example

`$ curl https://api.nicknguyencodes.com/doodles/categories`

---

## Response format

All responses are in JSON format, with the following fields:

- `data`: The data returned by the request. This will be an array of rows for requests to `/doodles`, or a single object for requests to `/doodles/:id` or `/doodles/random`.


