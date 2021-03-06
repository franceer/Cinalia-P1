﻿CREATE MATERIALIZED VIEW document_search_mview
(id, name, description, picture_url, picture_alt, picture_title, section_url, "type", tsv)
AS
SELECT p.id,
'<span>' || b.name || '</span> ' || p.name,
p.description,
p.picture_url,
p.picture_alt,
p.picture_title,
'products',
'product',
setweight(to_tsvector(unaccent(p.name)), 'A') || setweight(to_tsvector(unaccent(regexp_replace(string_agg(c.path::text, ' '), '[^\w]+', ' ', 'gi'))), 'B') || setweight(to_tsvector(unaccent(b.name)), 'B')
FROM products p
JOIN brands b ON p.brand_id = b.id
JOIN categories_products cp ON p.id = cp.product_id
JOIN categories c ON cp.category_id = c.id
WHERE p.is_published
GROUP BY p.id, b.name
UNION ALL
SELECT l.id,
l.name,
l.description,
NULL,
NULL,
NULL,
'looks',
'look',
setweight(to_tsvector(unaccent(l.name)), 'A') || setweight(to_tsvector(unaccent(regexp_replace(string_agg(c2.path::text, ' '), '[^\w]+', ' ', 'gi'))), 'B')
FROM looks l
JOIN categories_looks cl ON l.id = cl.look_id
JOIN categories c2 ON cl.category_id = c2.id
WHERE l.is_published
GROUP BY 1
UNION ALL
SELECT s.id,
s.name,
s.description,
s.picture_url,
s.picture_alt,
s.picture_title,
'sets',
'set',
setweight(to_tsvector(unaccent(s.name)), 'A') || setweight(to_tsvector(unaccent(regexp_replace(string_agg(c3.path::text, ' '), '[^\w]+', ' ', 'gi'))), 'B')
FROM sets s
JOIN categories_sets cs ON s.id = cs.set_id
JOIN categories c3 ON cs.category_id = c3.id
WHERE s.is_published
GROUP BY 1
UNION ALL
SELECT v.id,
v.name,
v.description,
v.poster_url,
v.poster_alt,
v.poster_title,
'movies',
'video media',
setweight(to_tsvector(unaccent(v.name)), 'A') || setweight(to_tsvector(unaccent(regexp_replace(string_agg(c4.path::text, ' '), '[^\w]+', ' ', 'gi'))), 'B') || setweight(to_tsvector(unaccent(coalesce(v.description,''))), 'D')
FROM video_medias v
JOIN categories_video_medias cv ON v.id = cv.video_media_id
JOIN categories c4 ON cv.category_id = c4.id
WHERE v.is_published
GROUP BY 1
UNION ALL
SELECT loc.id,
loc.name,
loc.description,
loc.picture_url,
loc.picture_alt,
loc.picture_title,
'locations',
'location',
setweight(to_tsvector(unaccent(loc.name)), 'A') || setweight(to_tsvector(unaccent(regexp_replace(string_agg(c5.path::text, ' '), '[^\w]+', ' ', 'gi'))), 'B')
FROM locations loc
JOIN categories_locations cloc ON loc.id = cloc.location_id
JOIN categories c5 ON cloc.category_id = c5.id
WHERE loc.is_published
GROUP BY 1;

CREATE INDEX idx_fts_search ON document_search_mview USING gin(tsv);
