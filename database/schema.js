'use strict';

var schema = {
    brands: {
        id: { type: 'specific', specificType: 'serial', nullable: false, primary: true },
        name: {type: 'string', maxlength: 64, nullable: false, unique: true}
    },
    body_locations: {
        id: { type: 'specific', specificType: 'serial', nullable: false, primary: true },
        name: {type: 'string', maxlength: 64, nullable: false, unique: true}
    },
	//Describe the character. Can be a woman a man or a child. Not the same as a genre since it can be a robot or a child.
	//Used to show the good dark silouhette type in the look page view.
    character_types: {
        id: { type: 'specific', specificType: 'serial', nullable: false, primary: true },
        name: { type: 'string', maxlength: 32, nullable: false, unique: true }
    },
    locations: {
        id: { type: 'specific', specificType: 'serial', nullable: false, primary: true },
        name: { type: 'string', maxlength: 64, nullable: false },
        description: { type: 'text', nullable: true },
        city_state_country: { type: 'string', maxlength: 128, nullable: false },
        picture_url: { type: 'string', maxlength: 400, nullable: false },
        picture_alt: { type: 'string', maxlength: 128, nullable: false },
        picture_title: { type: 'string', maxlength: 128, nullable: false },
        place_id: { type: 'string', maxlength: 64, nullable: false },
        latitude: { type: 'string', maxlength: 32, nullable: false },
        longitude: { type: 'string', maxlength: 32, nullable: false },
        zoom: { type: 'specific', specificType: 'smallint', nullable: false, defaultTo: 7 },
        created_at: { type: 'timestamp', nullable: false, defaultTo: 'now' },
        updated_at: { type: 'timestamp', nullable: true }
    },    
    matching_statuses: {
        id: { type: 'specific', specificType: 'serial', nullable: false, primary: true },
        name: { type: 'string', maxlength: 64, nullable: false, unique: true },
        display_name: { type: 'string', maxlength: 64, nullable: false }
    },	
	media_characters: {
        id: { type: 'specific', specificType: 'serial', nullable: false, primary: true },
        firstname: { type: 'string', maxlength: 64, nullable: false },
        lastname: { type: 'string', maxlength: 64, nullable: false },
        nickname: { type: 'string', maxlength: 64, nullable: true },
        character_type_id: { type: 'integer', nullable: false, unsigned: true, references: 'id', inTable: 'character_types', defaultTo: 1 }
    },
    media_genres: {
        id: { type: 'specific', specificType: 'serial', nullable: false, primary: true },
        name: { type: 'string', maxlength: 64, nullable: false, unique: true }
    },
    categories: {
        id: { type: 'specific', specificType: 'serial', nullable: false, primary: true },
        name: { type: 'string', maxlength: 64, nullable: false },
        path: {type: 'specific', specificType: 'ltree', nullable: false, unique: true}
        //sequence: { type: 'integer', nullable: false },
        //parent_id: { type: 'integer', nullable: false, unsigned: true }
    },
    //product_types: {
    //    id: { type: 'specific', specificType: 'serial', nullable: false, primary: true },
    //    name: { type: 'string', maxlength: 64, nullable: false, unique: true }
    //},
    user_types: {
        id: { type: 'specific', specificType: 'serial', nullable: false, primary: true },
        name: { type: 'string', maxlength: 64, nullable: false, unique: true }
    },
	worker_types: {
        id: { type: 'specific', specificType: 'serial', nullable: false, primary: true },
        name: { type: 'string', maxlength: 64, nullable: false, unique: true }
    },   
    video_medias: {
        id: { type: 'specific', specificType: 'serial', nullable: false, primary: true },
        name: { type: 'string', maxlength: 64, nullable: false },
        description: { type: 'text', nullable: true },
        theater_release_date: { type: 'date', nullable: false },
        tv_release_date: { type: 'date', nullable: false },
        duration: { type: 'integer', nullable: false },
        poster_url: { type: 'string', maxlength: 400, nullable: false },
        poster_alt: { type: 'string', maxlength: 128, nullable: false },
        poster_title: { type: 'string', maxlength: 128, nullable: false },
        video_thumbnail_url: { type: 'string', maxlength: 400, nullable: true },
        video_url: { type: 'string', maxlength: 400, nullable: false },
        video_caption: { type: 'string', maxlength: 64, nullable: true },
        synopsis: { type: 'text', nullable: true },
        tv_broadcaster: { type: 'string', maxlength: 64, nullable: false },
        media_genre_id: { type: 'integer', nullable: false, unsigned: true, references: 'id', inTable: 'media_genres' },
        social_data_id: { type: 'integer', nullable: false, unsigned: true, references: 'id', inTable: 'social_data' },
        created_at: { type: 'timestamp', nullable: false, defaultTo: 'now' },
        updated_at: { type: 'timestamp', nullable: true }
    },
    products: {
        id: { type: 'specific', specificType: 'serial', nullable: false, primary: true },
        name: { type: 'string', maxlength: 64, nullable: false, unique: true },
        picture_url: { type: 'string', maxlength: 400, nullable: false },
        picture_alt: { type: 'string', maxlength: 128, nullable: false },
        picture_title: { type: 'string', maxlength: 128, nullable: false },
        commercial_url: { type: 'string', maxlength: 400, nullable: false },
        price: { type: 'decimal', nullable: false },
        description: { type: 'text', nullable: true },
        brand_id: { type: 'integer', nullable: false, unsigned: true, references: 'id', inTable: 'brands' },
        //product_type_id: { type: 'integer', nullable: false, unsigned: true, references: 'id', inTable: 'product_types' },
		parent_product_id: { type: 'integer', nullable: true, unsigned: true, references: 'id', inTable: 'products' },
        created_at: { type: 'timestamp', nullable: false, defaultTo: 'now' },
        updated_at: { type: 'timestamp', nullable: true }
    },
    users: {
        id: { type: 'specific', specificType: 'serial', nullable: false, primary: true },
        username: { type: 'string', maxlength: 100, nullable: false, unique: true },
        password: { type: 'string', maxlength: 100, nullable: false },
        email: { type: 'string', maxlength: 150, nullable: false, unique: true },
        firstname: { type: 'string', maxlength: 64, nullable: true },
        lastname: { type: 'string', maxlength: 64, nullable: true },
        reset_password_token: { type: 'string', maxlength: 128, nullable: true },
        reset_password_expires: { type: 'timestamp', nullable: true },
        user_type_id: { type: 'integer', nullable: false, unsigned: true, references: 'id', inTable: 'user_types', defaultTo: 2 },
        is_active: { type: 'boolean', nullable: false, defaultTo: true },
        created_at: { type: 'timestamp', nullable: false, defaultTo: 'now' },
        updated_at: { type: 'timestamp', nullable: true }
    },
	user_profiles: {
		id: { type: 'specific', specificType: 'serial', nullable: false, primary: true },
		user_id: { type: 'integer', nullable: false, unsigned: true, references: 'id', inTable: 'users' }	
	},
	user_bookmarks :{
		id: { type: 'specific', specificType: 'serial', nullable: false, primary: true },
		user_id: {type: 'integer', nullable: false, unsigned: true, references: 'id', inTable: 'users'},
		bookmark_type: {type: 'string', maxlength: 32, nullable: false},
		bookmark_id: {type: 'integer', nullable: false, unsigned: true }
	},
	user_likes: {
	    id: { type: 'specific', specificType: 'serial', nullable: false, primary: true },
	    user_id: { type: 'integer', nullable: false, unsigned: true, references: 'id', inTable: 'users' },
	    target_type: { type: 'string', maxlength: 32, nullable: false },
	    target_id: { type: 'integer', nullable: false, unsigned: true }
	},
	workers: {
        id: { type: 'specific', specificType: 'serial', nullable: false, primary: true },
        firstname: { type: 'string', maxlength: 64, nullable: true },
        lastname: { type: 'string', maxlength: 64, nullable: true },        
        created_at: { type: 'timestamp', nullable: false, defaultTo: 'now' },
        updated_at: { type: 'timestamp', nullable: true }
    },
    products_video_medias: {
        id: { type: 'specific', specificType: 'serial', nullable: false, primary: true },
        time_codes: { type: 'specific', specificType: 'integer[]', nullable: true },
        appearing_context: { type: 'text', nullable: true },
        matching_status_id: { type: 'integer', nullable: false, unsigned: true, references: 'id', inTable: 'matching_statuses' },
        product_id: { type: 'integer', nullable: false, unsigned: true, references: 'id', inTable: 'products' },
        video_media_id: { type: 'integer', nullable: false, unsigned: true, references: 'id', inTable: 'video_medias' }
    },
    video_medias_workers: {
        id: { type: 'specific', specificType: 'serial', nullable: false, primary: true },
        worker_id: { type: 'integer', nullable: false, unsigned: true, references: 'id', inTable: 'workers' },
        video_media_id: { type: 'integer', nullable: false, unsigned: true, references: 'id', inTable: 'video_medias' },
        worker_type_id: { type: 'integer', nullable: false, unsigned: true, references: 'id', inTable: 'worker_types' }
    },
    locations_video_medias: {
        id: { type: 'specific', specificType: 'serial', nullable: false, primary: true },
        appearing_context: { type: 'text', nullable: true },
        time_codes: { type: 'specific', specificType: 'integer[]', nullable: true },
        location_id: { type: 'integer', nullable: false, unsigned: true, references: 'id', inTable: 'locations' },
        video_media_id: { type: 'integer', nullable: false, unsigned: true, references: 'id', inTable: 'video_medias' }
    },
    categories_products: {
        id: { type: 'specific', specificType: 'serial', nullable: false, primary: true },
        product_id: { type: 'integer', nullable: false, unsigned: true, references: 'id', inTable: 'products' },
        category_id: { type: 'integer', nullable: false, unsigned: true, references: 'id', inTable: 'categories' }
    },
    categories_video_medias: {
        id: { type: 'specific', specificType: 'serial', nullable: false, primary: true },
        video_media_id: { type: 'integer', nullable: false, unsigned: true, references: 'id', inTable: 'video_medias' },
        category_id: { type: 'integer', nullable: false, unsigned: true, references: 'id', inTable: 'categories' }
    },
    categories_locations: {
        id: { type: 'specific', specificType: 'serial', nullable: false, primary: true },
        location_id: { type: 'integer', nullable: false, unsigned: true, references: 'id', inTable: 'locations' },
        category_id: { type: 'integer', nullable: false, unsigned: true, references: 'id', inTable: 'categories' }
    },
    looks: {
        id: { type: 'specific', specificType: 'serial', nullable: false, primary: true },
        name: { type: 'string', maxlength: 64, nullable: false },
        description: { type: 'text', nullable: true },
        time_codes: { type: 'specific', specificType: 'integer[]', nullable: true },
        video_media_id: { type: 'integer', nullable: false, unsigned: true, references: 'id', inTable: 'video_medias' },
		media_character_id: { type: 'integer', nullable: false, unsigned: true, references: 'id', inTable: 'media_characters' },        
        created_at: { type: 'timestamp', nullable: false, defaultTo: 'now' },
        updated_at: { type: 'timestamp', nullable: true }
    },
    looks_products: {
        id: { type: 'specific', specificType: 'serial', nullable: false, primary: true },
        matching_status_id: { type: 'integer', nullable: false, unsigned: true, references: 'id', inTable: 'matching_statuses' },
        appearing_context: { type: 'text', nullable: true },
        order: { type: 'integer', nullable: true, unsigned: true },
        body_location_id: { type: 'integer', nullable: false, unsigned: true, references: 'id', inTable: 'body_locations' },
        look_id: { type: 'integer', nullable: false, unsigned: true, references: 'id', inTable: 'looks' },
        product_id: { type: 'integer', nullable: false, unsigned: true, references: 'id', inTable: 'products' }
    },
    categories_looks: {
        id: { type: 'specific', specificType: 'serial', nullable: false, primary: true },
        look_id: { type: 'integer', nullable: false, unsigned: true, references: 'id', inTable: 'looks' },
        category_id: { type: 'integer', nullable: false, unsigned: true, references: 'id', inTable: 'categories' }
    },
    sets: {
        id: { type: 'specific', specificType: 'serial', nullable: false, primary: true },
        name: { type: 'string', maxlength: 64, nullable: false },
        description: { type: 'text', nullable: true },
        picture_url: { type: 'string', maxlength: 400, nullable: false },
        picture_alt: { type: 'string', maxlength: 128, nullable: false },
        picture_title: { type: 'string', maxlength: 128, nullable: false },
        place: { type: 'string', maxlength: 128, nullable: true },
        time_codes: { type: 'specific', specificType: 'integer[]', nullable: true },
        video_media_id: { type: 'integer', nullable: false, unsigned: true, references: 'id', inTable: 'video_medias' },
        created_at: { type: 'timestamp', nullable: false, defaultTo: 'now' },
        updated_at: { type: 'timestamp', nullable: true }
    },
    products_sets: {
        id: { type: 'specific', specificType: 'serial', nullable: false, primary: true },
        matching_status_id: { type: 'integer', nullable: false, unsigned: true, references: 'id', inTable: 'matching_statuses' },
        appearing_context: { type: 'text', nullable: true },
        x_offset: { type: 'integer', nullable: false, defaultTo: 0 },
        y_offset: { type: 'integer', nullable: false, defaultTo: 0 },
        product_id: { type: 'integer', nullable: false, unsigned: true, references: 'id', inTable: 'products' },
        set_id: { type: 'integer', nullable: false, unsigned: true, references: 'id', inTable: 'sets' }
    },
    categories_sets: {
        id: { type: 'specific', specificType: 'serial', nullable: false, primary: true },
        set_id: { type: 'integer', nullable: false, unsigned: true, references: 'id', inTable: 'sets' },
        category_id: { type: 'integer', nullable: false, unsigned: true, references: 'id', inTable: 'categories' }
    }
};
module.exports = schema;