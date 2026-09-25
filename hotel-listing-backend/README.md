# Hotel Listing API

An Express REST API for hotel listings. It has register/login with JWT and image uploads, and it uses **no database**:

- Users and hotels are saved to `data/db.json`.
- Images are saved to `uploads/` and served at `http://localhost:4000/uploads/<file>`.

Both are created automatically on first use.

## Run

```bash
npm install
cp .env.example .env     # optional
npm run dev              # http://localhost:4000
```

CORS allows the frontend at `http://localhost:3000`. To allow other origins, change `CORS_ORIGIN` in `.env`.

## Endpoints

Protected routes need this header: `Authorization: Bearer <accessToken>`.

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/register` | – | `{ email, password, name }` → `{ accessToken, user }` |
| POST | `/login` | – | `{ email, password }` → `{ accessToken, user }` |
| GET | `/hotels` | – | All listings. Supports filter, search, sort and pagination (see below) |
| GET | `/hotels?userId=3` | – | One user's properties |
| GET | `/hotels/:id` | – | One listing |
| POST | `/hotels` | ✔ | The body **must** include `userId` (equal to the logged-in user) and `name`. The full field list is on the home page |
| PATCH / PUT | `/hotels/:id` | ✔ owner | Partial update |
| DELETE | `/hotels/:id` | ✔ owner | Also deletes the listing's images |

### Query parameters for `GET /hotels`

| Param | Example |
|---|---|
| Search all fields | `?q=beach` (or `?search=beach`) |
| Exact match (repeat the key for OR) | `?city=Goa&city=Delhi` |
| Range | `?price_gte=50&price_lte=200` (also `_gt`, `_lt`) |
| Contains | `?name_like=inn` |
| Not equal | `?city_ne=Goa` |
| Sort | `?_sort=price&_order=desc` (or `sort` / `order`) |
| Pagination | `?_page=2&_limit=10` (or `page` / `limit`) |

The response body is an array. The total count is in the `X-Total-Count` response header, and a `Link` header gives first/prev/next/last page URLs. Both headers are exposed through CORS.

### Images

Send the request as `multipart/form-data`, with one or more files in the `images` (or `image`) field. Each image can be up to 5 MB, with up to 10 images per request.

```bash
curl -X POST http://localhost:4000/hotels \
  -H "Authorization: Bearer $TOKEN" \
  -F userId=3 -F name="Sea View Inn" -F city=Goa -F price=120 \
  -F 'amenities=["wifi","pool"]' \
  -F images=@room1.jpg -F images=@room2.jpg
```

The listing is returned with `images: [url, ...]`, and `image` holds the first URL.

When you edit a listing:
- Uploaded files are **added** to the existing images.
- To remove images, send `images` as the list of existing URLs to keep. Any image not in the list is deleted.

In multipart requests, number, boolean and JSON values (arrays and objects) are converted back to their real types.

Plain JSON bodies (`Content-Type: application/json`) work too. In that case, pass `images` as an array of image URLs.
