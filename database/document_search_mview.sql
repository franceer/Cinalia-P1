CREATE MATERIALIZED VIEW document_search_mview
(id, name, description, picture_url, picture_alt, picture_title, section_url, tsv)
AS
SELECT p.id,
'<span>' || b.name || '</span> ' || p.name,
p.description,
p.picture_url,
p.picture_alt,
p.picture_title,
'products',
setweight(to_tsvector(unaccent(p.name)), 'A') || setweight(to_tsvector(unaccent(regexp_replace(string_agg(c.path::text, ' '), '[^\w]+', ' ', 'gi'))), 'B') || setweight(to_tsvector(unaccent(b.name)), 'B') || setweight(to_tsvector(unaccent(coalesce(p.description,''))), 'D')
FROM products p
JOIN brands b ON p.brand_id = b.id
JOIN categories_products cp ON p.id = cp.product_id
JOIN categories c ON cp.category_id = c.id
GROUP BY p.id, b.name
UNION ALL
SELECT l.id,
l.name,
l.description,
NULL,
NULL,
NULL,
'looks',
setweight(to_tsvector(unaccent(l.name)), 'A') || setweight(to_tsvector(unaccent(regexp_replace(string_agg(c2.path::text, ' '), '[^\w]+', ' ', 'gi'))), 'B') || setweight(to_tsvector(unaccent(coalesce(l.description,''))), 'D')
FROM looks l
JOIN categories_looks cl ON l.id = cl.look_id
JOIN categories c2 ON cl.category_id = c2.id
GROUP BY 1
UNION ALL
SELECT s.id,
s.name,
s.description,
s.picture_url,
s.picture_alt,
s.picture_title,
'sets',
setweight(to_tsvector(unaccent(s.name)), 'A') || setweight(to_tsvector(unaccent(regexp_replace(string_agg(c3.path::text, ' '), '[^\w]+', ' ', 'gi'))), 'B') || setweight(to_tsvector(unaccent(coalesce(s.description,''))), 'D')
FROM sets s
JOIN categories_sets cs ON s.id = cs.set_id
JOIN categories c3 ON cs.category_id = c3.id
GROUP BY 1
UNION ALL
SELECT v.id,
v.name,
v.description,
v.poster_url,
v.poster_alt,
v.poster_title,
'movies',
setweight(to_tsvector(unaccent(v.name)), 'A') || setweight(to_tsvector(unaccent(regexp_replace(string_agg(c4.path::text, ' '), '[^\w]+', ' ', 'gi'))), 'B') || setweight(to_tsvector(unaccent(coalesce(v.description,''))), 'D')
FROM video_medias v
JOIN categories_video_medias cv ON v.id = cv.video_media_id
JOIN categories c4 ON cv.category_id = c4.id
GROUP BY 1
UNION ALL
SELECT loc.id,
loc.name,
loc.description,
loc.picture_url,
loc.picture_alt,
loc.picture_title,
'locations',
setweight(to_tsvector(unaccent(loc.name)), 'A') || setweight(to_tsvector(unaccent(regexp_replace(string_agg(c5.path::text, ' '), '[^\w]+', ' ', 'gi'))), 'B') || setweight(to_tsvector(unaccent(coalesce(loc.description,''))), 'D')
FROM locations loc
JOIN categories_locations cloc ON loc.id = cloc.location_id
JOIN categories c5 ON cloc.category_id = c5.id
GROUP BY 1
