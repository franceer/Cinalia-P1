WITH similarproducts (id, product_name, brand_name, category_name, category_path) as (
select p.id, p.name, b.name, pc.name, pc.path
from products p
join brands b on b.id = p.brand_id
join product_categories_products pcp on pcp.product_id = p.id
join product_categories pc on pc.id = pcp.product_category_id
where pc.path ~'*.Tshirts.*')
Select id, product_name, brand_name, category_name, category_path
From similarproducts
UNION
select p1.id, p1.name, b1.name, pc1.name, pc1.path
from products p1
join brands b1 on b1.id = p1.brand_id
join product_categories_products pcp1 on pcp1.product_id = p1.id
join product_categories pc1 on pc1.id = pcp1.product_category_id
join products_video_medias pv1 on pv1.product_id = p1.id
join video_medias vm on vm.id = pv1.video_media_id
join looks_products lp on lp.product_id = p1.id
join looks l on l.id = lp.look_id
where not exists (select 1 from similarproducts) AND (vm.id = 1 or l.video_media_id = 1)