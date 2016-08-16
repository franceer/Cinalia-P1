CREATE MATERIALIZED VIEW document_search_mview
(id, name, description, picture_url, picture_alt, picture_title, section_url, tsv)
AS
SELECT products.id,
'<span>' || brands.name || '</span> ' || products.name,
products.description,
products.picture_url,
products.picture_alt,
products.picture_title,
'products',
setweight(to_tsvector(unaccent(products.name)), 'A') || setweight(to_tsvector(unaccent(regexp_replace(pc.path::text, '[^\w]+', ' ', 'gi'))), 'B') || setweight(to_tsvector(unaccent(brands.name)), 'B') || setweight(to_tsvector(unaccent(coalesce(products.description,''))), 'D')
FROM products
JOIN brands ON products.brand_id = brands.id
JOIN product_categories_products AS pcp ON products.id = pcp.product_id
JOIN product_categories AS pc ON pcp.product_category_id = pc.id
UNION ALL
SELECT looks.id,
looks.name,
looks.description,
NULL,
NULL,
NULL,
'looks',
setweight(to_tsvector(unaccent(looks.name)), 'A') || setweight(to_tsvector(unaccent(coalesce(looks.description,''))), 'D')
FROM looks
UNION ALL
SELECT sets.id,
sets.name,
sets.description,
sets.picture_url,
sets.picture_alt,
sets.picture_title,
'sets',
setweight(to_tsvector(unaccent(sets.name)), 'A') || setweight(to_tsvector(unaccent(coalesce(sets.description,''))), 'D')
FROM sets
UNION ALL
SELECT video_medias.id,
video_medias.title,
video_medias.description,
video_medias.poster_url,
video_medias.poster_alt,
video_medias.poster_title,
'movies',
setweight(to_tsvector(unaccent(video_medias.title)), 'A') || setweight(to_tsvector(unaccent(coalesce(video_medias.description,''))), 'D')
FROM video_medias
UNION ALL
SELECT locations.id,
locations.name,
locations.description,
locations.picture_url,
locations.picture_alt,
locations.picture_title,
'locations',
setweight(to_tsvector(unaccent(locations.name)), 'A') || setweight(to_tsvector(unaccent(coalesce(locations.description,''))), 'D')
FROM locations
