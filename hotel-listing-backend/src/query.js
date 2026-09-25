// json-server style querying for GET /hotels
//   ?q=beach                    full-text search across all fields
//   ?city=Paris&userId=3        exact match (repeat a key for OR: ?city=Paris&city=Rome)
//   ?price_gte=50&price_lte=200 ranges      ?name_like=inn   contains (case-insensitive)
//   ?city_ne=Paris              not equal
//   ?_sort=price&_order=desc    sorting (also: sort / order)
//   ?_page=2&_limit=10          pagination (also: page / limit)
// Total count is returned in the X-Total-Count header (+ Link header), and the body is an array.

const RESERVED = new Set(['q', 'search', '_sort', 'sort', '_order', 'order', '_page', 'page', '_limit', 'limit']);

const toArr = (v) => (Array.isArray(v) ? v : [v]);
const isNum = (v) => v !== '' && v !== null && !isNaN(Number(v));

function getPath(obj, key) {
  return key.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

function equals(value, expected) {
  if (Array.isArray(value)) return value.some((v) => equals(v, expected));
  if (value == null) return expected === 'null';
  return String(value).toLowerCase() === String(expected).toLowerCase();
}

function compare(a, b) {
  if (isNum(a) && isNum(b)) return Number(a) - Number(b);
  return String(a ?? '').localeCompare(String(b ?? ''));
}

function containsText(obj, text) {
  if (obj == null) return false;
  if (typeof obj === 'object') return Object.values(obj).some((v) => containsText(v, text));
  return String(obj).toLowerCase().includes(text);
}

function applyQuery(items, query) {
  let result = items;

  const q = query.q ?? query.search;
  if (q) {
    const text = String(q).toLowerCase().trim();
    result = result.filter((item) => containsText(item, text));
  }

  for (const [rawKey, rawVal] of Object.entries(query)) {
    if (RESERVED.has(rawKey)) continue;
    const values = toArr(rawVal);
    const m = rawKey.match(/^(.+)_(gte|lte|gt|lt|ne|like)$/);
    const key = m ? m[1] : rawKey;
    const op = m ? m[2] : 'eq';

    result = result.filter((item) => {
      const v = getPath(item, key);
      switch (op) {
        case 'gte': return values.every((x) => v != null && compare(v, x) >= 0);
        case 'lte': return values.every((x) => v != null && compare(v, x) <= 0);
        case 'gt': return values.every((x) => v != null && compare(v, x) > 0);
        case 'lt': return values.every((x) => v != null && compare(v, x) < 0);
        case 'ne': return values.every((x) => !equals(v, x));
        case 'like': return values.some((x) => v != null && String(v).toLowerCase().includes(String(x).toLowerCase()));
        default: return values.some((x) => equals(v, x));
      }
    });
  }

  const sort = query._sort ?? query.sort;
  if (sort) {
    const keys = String(sort).split(',');
    const orders = String(query._order ?? query.order ?? '').split(',');
    result = [...result].sort((a, b) => {
      for (let i = 0; i < keys.length; i++) {
        let key = keys[i].trim();
        let desc = (orders[i] || orders[0] || 'asc').toLowerCase() === 'desc';
        if (key.startsWith('-')) { key = key.slice(1); desc = true; }
        const c = compare(getPath(a, key), getPath(b, key));
        if (c !== 0) return desc ? -c : c;
      }
      return 0;
    });
  }

  const total = result.length;
  const page = query._page ?? query.page;
  const limitParam = query._limit ?? query.limit;
  let meta = { total, page: null, limit: null, pages: null };

  if (page || limitParam) {
    const limit = Math.max(1, Number(limitParam) || 10);
    const p = Math.max(1, Number(page) || 1);
    result = result.slice((p - 1) * limit, p * limit);
    meta = { total, page: p, limit, pages: Math.ceil(total / limit) };
  }

  return { data: result, meta };
}

module.exports = { applyQuery };
