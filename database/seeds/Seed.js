'use strict';
var sequence = require('when/sequence'),
    helper = require('../../helpers/helper'),
    _ = require('lodash');

exports.seed = function(knex, Promise) {
    return sequence([
      // Deletes ALL existing entries    
      function(){ return knex('user_bookmarks').del(); },
      function(){ return knex('user_likes').del(); },
      function(){ return knex('user_profiles').del(); },
      function(){ return knex('users').del(); },
      function(){ return knex('user_types').del(); },
      function(){ return knex('products_video_medias').del(); },
      function(){ return knex('looks_products').del(); },
      function(){ return knex('body_locations').del(); },
      function () { return knex('products_sets').del(); },
      function () { return knex('products_tags').del(); },
      //function(){ return knex('categories_products').del(); },    
      function(){ return knex('products').del(); },
      function(){ return knex('brands').del(); },    
      function(){ return knex('matching_statuses').del(); },    
      function () { return knex('locations_video_medias').del(); },
      function () { return knex('locations_tags').del(); },
      //function(){ return knex('categories_locations').del(); },
      function () { return knex('locations').del(); },
      function () { return knex('looks_tags').del(); },
      function () { return knex('sets_tags').del(); },
      //function(){ return knex('categories_looks').del(); },
      //function(){ return knex('categories_sets').del(); },
      function(){ return knex('looks').del(); },
      function(){ return knex('media_characters').del(); },
      function(){ return knex('character_types').del(); },
      function(){ return knex('sets').del(); },   
      function(){ return knex('video_medias_workers').del(); },
      function(){ return knex('workers').del(); },
      function () { return knex('worker_types').del(); },
      function () { return knex('tags_video_medias').del(); },
      //function(){ return knex('categories_video_medias').del(); },
      function () { return knex('video_medias').del(); },
      function () { return knex('tags').del(); }//,
      //function(){ return knex('categories').del(); },
      /*function () { return knex('media_genres').del(); }*/])
      .then(function () {
          return Promise.join(
              knex.raw('ALTER SEQUENCE body_locations_id_seq RESTART WITH 1;'),
              knex.raw('ALTER SEQUENCE brands_id_seq RESTART WITH 1;'),
              knex.raw('ALTER SEQUENCE tags_id_seq RESTART WITH 1;'),
              knex.raw('ALTER SEQUENCE locations_tags_id_seq RESTART WITH 1;'),
              knex.raw('ALTER SEQUENCE looks_tags_id_seq RESTART WITH 1;'),
              knex.raw('ALTER SEQUENCE products_tags_id_seq RESTART WITH 1;'),
              knex.raw('ALTER SEQUENCE sets_tags_id_seq RESTART WITH 1;'),
              knex.raw('ALTER SEQUENCE tags_video_medias_id_seq RESTART WITH 1;'),
              knex.raw('ALTER SEQUENCE character_types_id_seq RESTART WITH 1;'),
              knex.raw('ALTER SEQUENCE locations_id_seq RESTART WITH 1;'),
              knex.raw('ALTER SEQUENCE locations_video_medias_id_seq RESTART WITH 1;'),
              knex.raw('ALTER SEQUENCE looks_id_seq RESTART WITH 1;'),
              knex.raw('ALTER SEQUENCE looks_products_id_seq RESTART WITH 1;'),
              knex.raw('ALTER SEQUENCE matching_statuses_id_seq RESTART WITH 1;'),
              knex.raw('ALTER SEQUENCE media_characters_id_seq RESTART WITH 1;'),
              //knex.raw('ALTER SEQUENCE media_genres_id_seq RESTART WITH 1;'),
              knex.raw('ALTER SEQUENCE products_id_seq RESTART WITH 1;'),
              knex.raw('ALTER SEQUENCE products_sets_id_seq RESTART WITH 1;'),
              knex.raw('ALTER SEQUENCE products_video_medias_id_seq RESTART WITH 1;'),
              knex.raw('ALTER SEQUENCE sets_id_seq RESTART WITH 1;'),
              knex.raw('ALTER SEQUENCE user_bookmarks_id_seq RESTART WITH 1;'),
              knex.raw('ALTER SEQUENCE user_likes_id_seq RESTART WITH 1;'),
              knex.raw('ALTER SEQUENCE user_profiles_id_seq RESTART WITH 1;'),
              knex.raw('ALTER SEQUENCE user_types_id_seq RESTART WITH 1;'),
              knex.raw('ALTER SEQUENCE users_id_seq RESTART WITH 1;'),
              knex.raw('ALTER SEQUENCE video_medias_id_seq RESTART WITH 1;'),
              knex.raw('ALTER SEQUENCE video_medias_workers_id_seq RESTART WITH 1;'),
              knex.raw('ALTER SEQUENCE worker_types_id_seq RESTART WITH 1;'),
              knex.raw('ALTER SEQUENCE workers_id_seq RESTART WITH 1;')
          );
      })
      .then(function () {
          return Promise.join(

          knex('user_types').insert([{ name: 'admin' },
          { name: 'user' }]),

          knex('brands').insert([{ name: 'GOV Denim' },
          { name: 'Jah-Star' },
          { name: 'Fred Perry' },
          { name: 'Roberto Cavalli' },
          { name: 'Lacoste' },
          { name: 'Topshop' },
          { name: 'Apple' },
          { name: 'Maserati' },
          { name: 'Mercedes' },
          { name: 'Citroën' },
          { name: 'Wap Two' },
          { name: 'Domoclip' },
          { name: 'New Era' },
          { name: 'Nike' },
          { name: 'Beliani' },
          { name: 'Philips' },
          { name: 'Drawer' },
          { name: 'Gucci' },
          { name: 'Tom Ford' },
          { name: 'Carrera' },
          { name: 'Paul Smith' },
          { name: 'Fruit of the Loom' },
          { name: 'G-Star Raw' },
          { name: 'Casio' },
          { name: 'Rolex' },
          { name: 'Puma' }]),

          knex('body_locations').insert([{ name: 'head' },
          { name: 'chest' },
          { name: 'hands' },
          { name: 'legs' },
          { name: 'feet' }]),
		
          knex('character_types').insert([{ name: 'man' },
          { name: 'woman' },
          { name: 'young girl' },
          { name: 'young boy' },
          { name: 'robot' }]),

          knex('matching_statuses').insert([{ name: 'exact', display_name: 'Produit exact' },
          { name: 'close', display_name: 'Produit similaire' }]),

          //knex('media_genres').insert([{ name: 'Action' },
          //{ name: 'Animation' },
          //{ name: 'Arts Martiaux' },
          //{ name: 'Aventure' },
          //{ name: 'Biopic' },
          //{ name: 'Bollywood' },
          //{ name: 'Classique' },
          //{ name: 'Comédie' },
          //{ name: 'Comédie dramatique' },
          //{ name: 'Comédie musicale' },
          //{ name: 'Concert' },
          //{ name: 'Dessin animé' },
          //{ name: 'Documentaire' },
          //{ name: 'Drama' },
          //{ name: 'Drame' },
          //{ name: 'Epouvante-horreur' },
          //{ name: 'Erotique' },
          //{ name: 'Espionnage' },
          //{ name: 'Expérimental' },
          //{ name: 'Famille' },
          //{ name: 'Fantastique' },
          //{ name: 'Guerre' },
          //{ name: 'Historique' },
          //{ name: 'Judiciaire' },
          //{ name: 'Movie night' },
          //{ name: 'Musical' },
          //{ name: 'Opera' },
          //{ name: 'Péplum' },
          //{ name: 'Policier' },
          //{ name: 'Romance' },
          //{ name: 'Science fiction' },
          //{ name: 'Show' },
          //{ name: 'Sport event' },
          //{ name: 'Thriller' },
          //{ name: 'Western' }]),       

          knex('tags').insert([{ name: 'Root', path: 'Root' },
          { name: 'Produits', path: 'Produits' },
          { name: 'Mode', path: 'Produits.Mode' },
          { name: 'Mode Homme', path: 'Produits.Mode.Homme' },
          { name: 'Vêtements Homme', path: 'Produits.Mode.Homme.Vêtements' },
          { name: 'T-shirts Homme', path: 'Produits.Mode.Homme.Vêtements.Tshirts' },
          { name: 'Polos', path: 'Produits.Mode.Homme.Vêtements.Polos' },
          { name: 'Vestes Homme', path: 'Produits.Mode.Homme.Vêtements.Vestes' },
          { name: 'Manteaux Homme', path: 'Produits.Mode.Homme.Vêtements.Manteaux' },
          { name: 'Chemises Homme', path: 'Produits.Mode.Homme.Vêtements.Chemises' },
          { name: 'Pulls Homme', path: 'Produits.Mode.Homme.Vêtements.Pulls' },
          { name: 'Sweats Homme', path: 'Produits.Mode.Homme.Vêtements.Sweats' },
          { name: 'Jeans Homme', path: 'Produits.Mode.Homme.Vêtements.Jeans' },
          { name: 'Pantalons Homme', path: 'Produits.Mode.Homme.Vêtements.Pantalons' },
          { name: 'Shorts Homme', path: 'Produits.Mode.Homme.Vêtements.Shorts' },
          { name: 'Costumes Homme', path: 'Produits.Mode.Homme.Vêtements.Costumes' },
          { name: 'Gilets Homme', path: 'Produits.Mode.Homme.Vêtements.Gilets' },
          { name: 'Sous-vêtements Homme', path: 'Produits.Mode.Homme.Sousvêtements' },
          { name: 'Maillots de bain Homme', path: 'Produits.Mode.Homme.Maillots_de_bain' },
          { name: 'Chaussures Homme', path: 'Produits.Mode.Homme.Chaussures' },
          { name: 'Baskets Homme', path: 'Produits.Mode.Homme.Chaussures.Baskets' },
          { name: 'Chaussures de ville Homme', path: 'Produits.Mode.Homme.Chaussures.Chaussures_de_ville' },
          { name: 'Mocassins Homme', path: 'Produits.Mode.Homme.Chaussures.Mocassins' },
          { name: 'Espadrilles Homme', path: 'Produits.Mode.Homme.Chaussures.Espadrilles' },
          { name: 'Sandales Homme', path: 'Produits.Mode.Homme.Chaussures.Sandales' },
          { name: 'Sacs et accessoires Homme', path: 'Produits.Mode.Homme.Sacs_et_accessoires' },
          { name: 'Sacs Homme', path: 'Produits.Mode.Homme.Sacs_et_accessoires.Sacs' },
          { name: 'Montres Homme', path: 'Produits.Mode.Homme.Sacs_et_accessoires.Montres' },
          { name: 'Ceintures Homme', path: 'Produits.Mode.Homme.Sacs_et_accessoires.Ceintures' },
          { name: 'Echarpes et foulards Homme', path: 'Produits.Mode.Homme.Sacs_et_accessoires.Echarpes_et_foulards' },
          { name: 'Lunettes Homme', path: 'Produits.Mode.Homme.Sacs_et_accessoires.Lunettes' },
          { name: 'Chapeaux et casquettes Homme', path: 'Produits.Mode.Homme.Sacs_et_accessoires.Chapeaux_et_casquettes' },
          { name: 'Bagages', path: 'Produits.Mode.Homme.Sacs_et_accessoires.Bagages' },
          { name: 'Mode Femme', path: 'Produits.Mode.Femme' },
          { name: 'Vêtements Femme', path: 'Produits.Mode.Femme.Vêtements' },
          { name: 'Robes', path: 'Produits.Mode.Femme.Vêtements.Robes' },
          { name: 'Jupes', path: 'Produits.Mode.Femme.Vêtements.Jupes' },
          { name: 'Tops et T-shirts', path: 'Produits.Mode.Femme.Vêtements.Tops_et_Tshirts' },
          { name: 'Débardeurs', path: 'Produits.Mode.Femme.Vêtements.Débardeurs' },
          { name: 'Vestes et manteaux Femme', path: 'Produits.Mode.Femme.Vêtements.Vestes_et_manteaux' },
          { name: 'Jeans Femme', path: 'Produits.Mode.Femme.Vêtements.Jeans' },
          { name: 'Chemises et blouses', path: 'Produits.Mode.Femme.Vêtements.Chemises_et_blouses' },
          { name: 'Pantalon et shorts Femme', path: 'Produits.Mode.Femme.Vêtements.Pantalons_et_shorts' },
          { name: 'Pulls et gilets Femme', path: 'Produits.Mode.Femme.Vêtements.Pulls_et_gilets' },
          { name: 'Maillots de bain Femme', path: 'Produits.Mode.Femme.Maillots_de_bain' },
          { name: 'Lingerie', path: 'Produits.Mode.Femme.Lingerie' },
          { name: 'Soutiens-gorges', path: 'Produits.Mode.Femme.Lingerie.Soutiensgorges' },
          { name: 'Culottes', path: 'Produits.Mode.Femme.Lingerie.Culottes' },
          { name: 'Collants', path: 'Produits.Mode.Femme.Lingerie.Collants' },
          { name: 'Homewear', path: 'Produits.Mode.Femme.Lingerie.Homewear' },
          { name: 'Sacs et accessoires Femme', path: 'Produits.Mode.Femme.Sacs_et_accessoires' },
          { name: 'Sacs Femme', path: 'Produits.Mode.Femme.Sacs_et_accessoires.Sacs' },
          { name: 'Montres Femme', path: 'Produits.Mode.Femme.Sacs_et_accessoires.Montres' },
          { name: 'Bijoux', path: 'Produits.Mode.Femme.Sacs_et_accessoires.Bijoux' },
          { name: 'Echarpes et foulards Femme', path: 'Produits.Mode.Femme.Sacs_et_accessoires.Echarpes_et_foulards' },
          { name: 'Chapeaux Femme', path: 'Produits.Mode.Femme.Sacs_et_accessoires.Chapeaux' },
          { name: 'Lunettes Femme', path: 'Produits.Mode.Femme.Sacs_et_accessoires.Lunettes' },
          { name: 'Chaussures Femme', path: 'Produits.Mode.Femme.Chaussures' },
          { name: 'Sandales Femme', path: 'Produits.Mode.Femme.Chaussures.Sandales' },
          { name: 'Baskets Femme', path: 'Produits.Mode.Femme.Chaussures.Baskets' },
          { name: 'Bottines et bottes', path: 'Produits.Mode.Femme.Chaussures.Bottines_et_bottes' },
          { name: 'Ballerines', path: 'Produits.Mode.Femme.Chaussures.Ballerines' },
          { name: 'Escarpins', path: 'Produits.Mode.Femme.Chaussures.Escarpins' },
          { name: 'Mocassins Femme', path: 'Produits.Mode.Femme.Chaussures.Mocassins' },
          { name: 'Espadrilles Femme', path: 'Produits.Mode.Femme.Chaussures.Espadrilles' },
          { name: 'Mode Enfant', path: 'Produits.Mode.Enfant' },
          { name: 'Mode Garçon', path: 'Produits.Mode.Enfant.Garçon' },
          { name: 'Vestes et manteaux Garçon', path: 'Produits.Mode.Enfant.Garçon.Vestes_et_manteaux' },
          { name: 'Pulls et gilets Garçon', path: 'Produits.Mode.Enfant.Garçon.Pulls_et_gilets' },
          { name: 'T-shirts et chemises Garçon', path: 'Produits.Mode.Enfant.Garçon.Tshirts_et_chemises' },
          { name: 'Shorts et bermudas', path: 'Produits.Mode.Enfant.Garçon.Shorts_et_bermudas' },
          { name: 'Jeans et pantalons Garçon', path: 'Produits.Mode.Enfant.Garçon.Jeans_et_pantalons' },
          { name: 'Sous-vêtements et pyjamas Garçon', path: 'Produits.Mode.Enfant.Garçon.Sousvêtements_et_pyjamas' },
          { name: 'Maillots de bain Garçon', path: 'Produits.Mode.Enfant.Garçon.Maillots_de_bain' },
          { name: 'Mode Fille', path: 'Produits.Mode.Enfant.Fille' },
          { name: 'Robes', path: 'Produits.Mode.Enfant.Fille.Robes' },
          { name: 'Jupes', path: 'Produits.Mode.Enfant.Fille.Jupes' },
          { name: 'Tops, blouses et chemises', path: 'Produits.Mode.Enfant.Fille.Tops_blouses_et_chemises' },
          { name: 'Débardeurs', path: 'Produits.Mode.Enfant.Fille.Débardeurs' },
          { name: 'Vestes et manteaux Fille', path: 'Produits.Mode.Enfant.Fille.Vestes_et_manteaux' },
          { name: 'Jeans et pantalons Fille', path: 'Produits.Mode.Enfant.Fille.Jeans_et_pantalons' },
          { name: 'Chemises et blouses', path: 'Produits.Mode.Enfant.Fille.Chemises_et_blouses' },
          { name: 'Shorts et pantacourts Fille', path: 'Produits.Mode.Enfant.Fille.Shorts_et_pantacourts' },
          { name: 'Pulls et gilets Fille', path: 'Produits.Mode.Enfant.Fille.Pulls_et_gilets' },
          { name: 'Sous-vêtements et pyjamas Fille', path: 'Produits.Mode.Enfant.Fille.Sousvêtements_et_pyjamas' },
          { name: 'Maillots de bain Fille', path: 'Produits.Mode.Enfant.Fille.Maillots_de_bain' },
          { name: 'Décoration et High Tech', path: 'Produits.Décoration_et_High_Tech' },
          { name: 'Chaises et tabourets', path: 'Produits.Décoration_et_High_Tech.Chaises_et_tabourets' },
          { name: 'Canapés et fauteuils', path: 'Produits.Décoration_et_High_Tech.Canapés_et_fauteuils' },
          { name: 'Luminaires', path: 'Produits.Décoration_et_High_Tech.Luminaires' },
          { name: 'Horloges et miroirs', path: 'Produits.Décoration_et_High_Tech.Horloges_et_miroirs' },
          { name: 'Mobilier', path: 'Produits.Décoration_et_High_Tech.Mobilier' },
          { name: 'Sculptures', path: 'Produits.Décoration_et_High_Tech.Sculptures' },
          { name: 'Tableaux et posters', path: 'Produits.Décoration_et_High_Tech.Tableaux_et_posters' },
          { name: 'Accessoires de déco', path: 'Produits.Décoration_et_High_Tech.Accessoires_de_déco' },
          { name: 'High Tech', path: 'Produits.Décoration_et_High_Tech.HighTech' },
          { name: 'Transport', path: 'Produits.Transport' },
          { name: 'Voitures', path: 'Produits.Transport.Voitures' },
          { name: 'Avions', path: 'Produits.Transport.Avions' },
          { name: 'Motos', path: 'Produits.Transport.Motos' },
          { name: 'Divers', path: 'Produits.Transport.Divers' },
          { name: 'Lieux', path: 'Lieux' },
          { name: 'Looks', path: 'Looks' },
          { name: 'Décors', path: 'Décors' },
          { name: 'Films', path: 'Films' },
          { name: 'Action' , path: 'Films.Action' },
          { name: 'Animation', path: 'Films.Animation' },
          { name: 'Arts Martiaux', path: 'Films.Arts_Martiaux' },
          { name: 'Aventure', path: 'Films.Aventure' },
          { name: 'Biopic', path: 'Films.Biopic' },
          { name: 'Bollywood', path: 'Films.Bollywood' },
          { name: 'Classique', path: 'Films.Classique' },
          { name: 'Comédie', path: 'Films.Comédie' },
          { name: 'Comédie dramatique', path: 'Films.Comédie_dramatique' },
          { name: 'Comédie musicale', path: 'Films.Comédie_musicale' },
          { name: 'Concert', path: 'Films.Concert' },
          { name: 'Dessin animé', path: 'Films.Dessin_animé' },
          { name: 'Documentaire', path: 'Films.Documentaire' },
          { name: 'Drama', path: 'Films.Drama' },
          { name: 'Drame', path: 'Films.Drame' },
          { name: 'Epouvante-horreur', path: 'Films.Epouvante_horreur' },
          { name: 'Erotique', path: 'Films.Erotique' },
          { name: 'Espionnage', path: 'Films.Espionnage' },
          { name: 'Expérimental', path: 'Films.Expérimental' },
          { name: 'Famille', path: 'Films.Famille' },
          { name: 'Fantastique', path: 'Films.Fantastique' },
          { name: 'Guerre', path: 'Films.Guerre' },
          { name: 'Historique', path: 'Films.Historique' },
          { name: 'Judiciaire', path: 'Films.Judiciaire' },
          { name: 'Movie night', path: 'Films.Movie_night' },
          { name: 'Musical', path: 'Films.Musical' },
          { name: 'Opera', path: 'Films.Opera' },
          { name: 'Péplum', path: 'Films.Péplum' },
          { name: 'Policier', path: 'Films.Policier' },
          { name: 'Romance', path: 'Films.Romance' },
          { name: 'Science fiction', path: 'Films.Science_fiction' },
          { name: 'Show', path: 'Films.Show' },
          { name: 'Sport event', path: 'Films.Sport_event' },
          { name: 'Thriller', path: 'Films.Thriller' },
          { name: 'Western', path: 'Films.Western' },
          { name: 'Séries', path: 'Séries' },
          { name: 'Clips', path: 'Clips' }]),

          //knex('categories').insert([{ name: 'Root', path: 'Root' },
          //{ name: 'Produits', path: 'Root.Produits' },
          //{ name: 'Mode', path: 'Root.Produits.Mode' },
          //{ name: 'Mode Homme', path: 'Root.Produits.Mode.Homme' },
          //{ name: 'Vêtements Homme', path: 'Root.Produits.Mode.Homme.Vêtements' },
          //{ name: 'T-shirts Homme', path: 'Root.Produits.Mode.Homme.Vêtements.Tshirts' },
          //{ name: 'Polos', path: 'Root.Produits.Mode.Homme.Vêtements.Polos' },
          //{ name: 'Vestes Homme', path: 'Root.Produits.Mode.Homme.Vêtements.Vestes' },
          //{ name: 'Manteaux Homme', path: 'Root.Produits.Mode.Homme.Vêtements.Manteaux' },
          //{ name: 'Chemises Homme', path: 'Root.Produits.Mode.Homme.Vêtements.Chemises' },
          //{ name: 'Pulls Homme', path: 'Root.Produits.Mode.Homme.Vêtements.Pulls' },
          //{ name: 'Sweats Homme', path: 'Root.Produits.Mode.Homme.Vêtements.Sweats' },
          //{ name: 'Jeans Homme', path: 'Root.Produits.Mode.Homme.Vêtements.Jeans' },
          //{ name: 'Pantalons Homme', path: 'Root.Produits.Mode.Homme.Vêtements.Pantalons' },
          //{ name: 'Shorts Homme', path: 'Root.Produits.Mode.Homme.Vêtements.Shorts' },
          //{ name: 'Costumes Homme', path: 'Root.Produits.Mode.Homme.Vêtements.Costumes' },
          //{ name: 'Gilets Homme', path: 'Root.Produits.Mode.Homme.Vêtements.Gilets' },
          //{ name: 'Sous-vêtements Homme', path: 'Root.Produits.Mode.Homme.Sousvêtements' },
          //{ name: 'Maillots de bain Homme', path: 'Root.Produits.Mode.Homme.Maillots_de_bain' },
          //{ name: 'Chaussures Homme', path: 'Root.Produits.Mode.Homme.Chaussures' },
          //{ name: 'Baskets Homme', path: 'Root.Produits.Mode.Homme.Chaussures.Baskets' },
          //{ name: 'Chaussures de ville Homme', path: 'Root.Produits.Mode.Homme.Chaussures.Chaussures_de_ville' },
          //{ name: 'Mocassins Homme', path: 'Root.Produits.Mode.Homme.Chaussures.Mocassins' },
          //{ name: 'Espadrilles Homme', path: 'Root.Produits.Mode.Homme.Chaussures.Espadrilles' },
          //{ name: 'Sandales Homme', path: 'Root.Produits.Mode.Homme.Chaussures.Sandales' },
          //{ name: 'Sacs et accessoires Homme', path: 'Root.Produits.Mode.Homme.Sacs_et_accessoires' },
          //{ name: 'Sacs Homme', path: 'Root.Produits.Mode.Homme.Sacs_et_accessoires.Sacs' },
          //{ name: 'Montres Homme', path: 'Root.Produits.Mode.Homme.Sacs_et_accessoires.Montres' },
          //{ name: 'Ceintures Homme', path: 'Root.Produits.Mode.Homme.Sacs_et_accessoires.Ceintures' },
          //{ name: 'Echarpes et foulards Homme', path: 'Root.Produits.Mode.Homme.Sacs_et_accessoires.Echarpes_et_foulards' },
          //{ name: 'Lunettes Homme', path: 'Root.Produits.Mode.Homme.Sacs_et_accessoires.Lunettes' },
          //{ name: 'Chapeaux et casquettes Homme', path: 'Root.Produits.Mode.Homme.Sacs_et_accessoires.Chapeaux_et_casquettes' },
          //{ name: 'Bagages', path: 'Root.Produits.Mode.Homme.Sacs_et_accessoires.Bagages' },
          //{ name: 'Mode Femme', path: 'Root.Produits.Mode.Femme' },
          //{ name: 'Vêtements Femme', path: 'Root.Produits.Mode.Femme.Vêtements' },
          //{ name: 'Robes', path: 'Root.Produits.Mode.Femme.Vêtements.Robes' },
          //{ name: 'Jupes', path: 'Root.Produits.Mode.Femme.Vêtements.Jupes' },
          //{ name: 'Tops et T-shirts', path: 'Root.Produits.Mode.Femme.Vêtements.Tops_et_Tshirts' },
          //{ name: 'Débardeurs', path: 'Root.Produits.Mode.Femme.Vêtements.Débardeurs' },
          //{ name: 'Vestes et manteaux Femme', path: 'Root.Produits.Mode.Femme.Vêtements.Vestes_et_manteaux' },
          //{ name: 'Jeans Femme', path: 'Root.Produits.Mode.Femme.Vêtements.Jeans' },
          //{ name: 'Chemises et blouses', path: 'Root.Produits.Mode.Femme.Vêtements.Chemises_et_blouses' },
          //{ name: 'Pantalon et shorts Femme', path: 'Root.Produits.Mode.Femme.Vêtements.Pantalons_et_shorts' },
          //{ name: 'Pulls et gilets Femme', path: 'Root.Produits.Mode.Femme.Vêtements.Pulls_et_gilets' },
          //{ name: 'Maillots de bain Femme', path: 'Root.Produits.Mode.Femme.Maillots_de_bain' },
          //{ name: 'Lingerie', path: 'Root.Produits.Mode.Femme.Lingerie' },
          //{ name: 'Soutiens-gorges', path: 'Root.Produits.Mode.Femme.Lingerie.Soutiensgorges' },
          //{ name: 'Culottes', path: 'Root.Produits.Mode.Femme.Lingerie.Culottes' },
          //{ name: 'Collants', path: 'Root.Produits.Mode.Femme.Lingerie.Collants' },
          //{ name: 'Homewear', path: 'Root.Produits.Mode.Femme.Lingerie.Homewear' },
          //{ name: 'Sacs et accessoires Femme', path: 'Root.Produits.Mode.Femme.Sacs_et_accessoires' },
          //{ name: 'Sacs Femme', path: 'Root.Produits.Mode.Femme.Sacs_et_accessoires.Sacs' },
          //{ name: 'Montres Femme', path: 'Root.Produits.Mode.Femme.Sacs_et_accessoires.Montres' },
          //{ name: 'Bijoux', path: 'Root.Produits.Mode.Femme.Sacs_et_accessoires.Bijoux' },
          //{ name: 'Echarpes et foulards Femme', path: 'Root.Produits.Mode.Femme.Sacs_et_accessoires.Echarpes_et_foulards' },
          //{ name: 'Chapeaux Femme', path: 'Root.Produits.Mode.Femme.Sacs_et_accessoires.Chapeaux' },
          //{ name: 'Lunettes Femme', path: 'Root.Produits.Mode.Femme.Sacs_et_accessoires.Lunettes' },
          //{ name: 'Chaussures Femme', path: 'Root.Produits.Mode.Femme.Chaussures' },
          //{ name: 'Sandales Femme', path: 'Root.Produits.Mode.Femme.Chaussures.Sandales' },
          //{ name: 'Baskets Femme', path: 'Root.Produits.Mode.Femme.Chaussures.Baskets' },
          //{ name: 'Bottines et bottes', path: 'Root.Produits.Mode.Femme.Chaussures.Bottines_et_bottes' },
          //{ name: 'Ballerines', path: 'Root.Produits.Mode.Femme.Chaussures.Ballerines' },
          //{ name: 'Escarpins', path: 'Root.Produits.Mode.Femme.Chaussures.Escarpins' },
          //{ name: 'Mocassins Femme', path: 'Root.Produits.Mode.Femme.Chaussures.Mocassins' },
          //{ name: 'Espadrilles Femme', path: 'Root.Produits.Mode.Femme.Chaussures.Espadrilles' },
          //{ name: 'Mode Enfant', path: 'Root.Produits.Mode.Enfant' },
          //{ name: 'Mode Garçon', path: 'Root.Produits.Mode.Enfant.Garçon' },
          //{ name: 'Vestes et manteaux Garçon', path: 'Root.Produits.Mode.Enfant.Garçon.Vestes_et_manteaux' },
          //{ name: 'Pulls et gilets Garçon', path: 'Root.Produits.Mode.Enfant.Garçon.Pulls_et_gilets' },
          //{ name: 'T-shirts et chemises Garçon', path: 'Root.Produits.Mode.Enfant.Garçon.Tshirts_et_chemises' },
          //{ name: 'Shorts et bermudas', path: 'Root.Produits.Mode.Enfant.Garçon.Shorts_et_bermudas' },
          //{ name: 'Jeans et pantalons Garçon', path: 'Root.Produits.Mode.Enfant.Garçon.Jeans_et_pantalons' },
          //{ name: 'Sous-vêtements et pyjamas Garçon', path: 'Root.Produits.Mode.Enfant.Garçon.Sousvêtements_et_pyjamas' },
          //{ name: 'Maillots de bain Garçon', path: 'Root.Produits.Mode.Enfant.Garçon.Maillots_de_bain' },
          //{ name: 'Mode Fille', path: 'Root.Produits.Mode.Enfant.Fille' },
          //{ name: 'Robes', path: 'Root.Produits.Mode.Enfant.Fille.Robes' },
          //{ name: 'Jupes', path: 'Root.Produits.Mode.Enfant.Fille.Jupes' },
          //{ name: 'Tops, blouses et chemises', path: 'Root.Produits.Mode.Enfant.Fille.Tops_blouses_et_chemises' },
          //{ name: 'Débardeurs', path: 'Root.Produits.Mode.Enfant.Fille.Débardeurs' },
          //{ name: 'Vestes et manteaux Fille', path: 'Root.Produits.Mode.Enfant.Fille.Vestes_et_manteaux' },
          //{ name: 'Jeans et pantalons Fille', path: 'Root.Produits.Mode.Enfant.Fille.Jeans_et_pantalons' },
          //{ name: 'Chemises et blouses', path: 'Root.Produits.Mode.Enfant.Fille.Chemises_et_blouses' },
          //{ name: 'Shorts et pantacourts Fille', path: 'Root.Produits.Mode.Enfant.Fille.Shorts_et_pantacourts' },
          //{ name: 'Pulls et gilets Fille', path: 'Root.Produits.Mode.Enfant.Fille.Pulls_et_gilets' },
          //{ name: 'Sous-vêtements et pyjamas Fille', path: 'Root.Produits.Mode.Enfant.Fille.Sousvêtements_et_pyjamas' },
          //{ name: 'Maillots de bain Fille', path: 'Root.Produits.Mode.Enfant.Fille.Maillots_de_bain' },
          //{ name: 'Décoration et High Tech', path: 'Root.Produits.Décoration_et_High_Tech' },
          //{ name: 'Chaises et tabourets', path: 'Root.Produits.Décoration_et_High_Tech.Chaises_et_tabourets' },
          //{ name: 'Canapés et fauteuils', path: 'Root.Produits.Décoration_et_High_Tech.Canapés_et_fauteuils' },
          //{ name: 'Luminaires', path: 'Root.Produits.Décoration_et_High_Tech.Luminaires' },
          //{ name: 'Horloges et miroirs', path: 'Root.Produits.Décoration_et_High_Tech.Horloges_et_miroirs' },
          //{ name: 'Mobilier', path: 'Root.Produits.Décoration_et_High_Tech.Mobilier' },
          //{ name: 'Sculptures', path: 'Root.Produits.Décoration_et_High_Tech.Sculptures' },
          //{ name: 'Tableaux et posters', path: 'Root.Produits.Décoration_et_High_Tech.Tableaux_et_posters' },
          //{ name: 'Accessoires de déco', path: 'Root.Produits.Décoration_et_High_Tech.Accessoires_de_déco' },
          //{ name: 'High Tech', path: 'Root.Produits.Décoration_et_High_Tech.HighTech' },
          //{ name: 'Transport', path: 'Root.Produits.Transport' },
          //{ name: 'Voitures', path: 'Root.Produits.Transport.Voitures' },
          //{ name: 'Avions', path: 'Root.Produits.Transport.Avions' },
          //{ name: 'Motos', path: 'Root.Produits.Transport.Motos' },
          //{ name: 'Divers', path: 'Root.Produits.Transport.Divers' },
          //{ name: 'Lieux', path: 'Root.Lieux' },
          //{ name: 'Looks', path: 'Root.Looks' },
          //{ name: 'Décors', path: 'Root.Décors' },
          //{ name: 'Films', path: 'Root.Films' },
          //{ name: 'Séries', path: 'Root.Séries' },
          //{ name: 'Clips', path: 'Root.Clips' }]),
        
          knex('worker_types').insert([{ name: 'director' },
          { name: 'actor' },
          { name: 'costume supervisor' },
          { name: 'key set decorator' },
          { name: 'set dresser' },
          { name: 'productor'}]));
      })
      .then(function () {
          return Promise.join(
		
          knex('media_characters').insert([{ firstname: 'Samuel' },
          { firstname: 'Timothée' },
          { firstname: 'Vadim' },
          { firstname: 'Julia', character_type_id: 2 },
          { firstname: 'Nestor' },
          { firstname: 'David', lastname: 'Packouz' },
          { firstname: 'Efraim', lastname: 'Diveroli' },
          { firstname: 'Henry', lastname: 'Girard' }]),
		
          knex('workers').insert([{ firstname: 'Igor', lastname: 'Gotesman' },
          { firstname: 'Pierre', lastname: 'Niney' },
          { firstname: 'François', lastname: 'Civil' },
          { firstname: 'Margot', lastname: 'Bancilhon' },
          { firstname: 'Idrissa', lastname: 'Hanrot' },
          { firstname: 'Elise', lastname: 'Bouquet' },
          { firstname: 'Reem', lastname: 'Kuzayli' },
          { firstname: 'Nicolas', lastname: 'de Boiscuillé' },
          { firstname: 'Muriel', lastname: 'Chinal' },
          { company_name: 'Les films du Kiosque' },
          { company_name: 'Green Hat Films' },
          { company_name: 'The Mark Gordon Company' }
          ]),
				
          knex('users').insert([{ username: 'admin', password: '$2a$10$lYdRv5bHQvsyuSmTPKLGqubvy8V.uHXQP17gJ2lGBDKXsCcxda5iO', email: 'admin@pickedin.com', user_type_id: 1 }]));        
      })
    .then(function () {
        var locationSeeds = [{ name: 'Jardin du Luxembourg', description: 'Le jardin du Luxembourg est un jardin ouvert au public, situé dans le 6e arrondissement de Paris. Il comprend un musée, un hôtel particulier, une orangerie, un manège...', city_state_country: 'Paris 6ème arrondissement, France', picture_url: 'http://fabientijou.com/wp-content/uploads/2014/04/Michel-Jardin-1100px-L.jpg', picture_alt: 'Jardin du Luxembourg', picture_title: 'Jardin du Luxembourg', place_id: 'ChIJe2jeNttx5kcRi_mJsGHdkQc', latitude: '48.8462252', longitude: '2.3349718', zoom: '13', is_published: true },
          { name: 'Le Pentagone', description: 'Le Pentagone est un bâtiment qui se trouve à Arlington en Virginie, près de Washington, la capitale fédérale des États-Unis. Cet édifice abrite le quartier général du département de la Défense. En 2009, plus de 26 000 personnes y travaillent, parmi lesquelles des civils et des militaires. Son nom provient de la forme de son plan, un pentagone. (wikipédia)', city_state_country: 'Arlington, Virgine - USA', picture_url: 'http://www.silicon.fr/wp-content/uploads/2016/03/Pentagone.jpg', picture_alt: 'Le Pentagone', picture_title: 'Le Pentagone', place_id: 'ChIJJyztKd-2t4kRL1MTwPjQg68', latitude: '38.8713995', longitude: '-77.0571467', zoom: '16', is_published: true }];

        return Promise.all(locationSeeds.map(function (seed) {
            return helper.uploadImagesToS3({ body: seed }, 'picture_url', ['name'], 'locations');
        }))
        .then(function (groupOfFiles) {
            locationSeeds.forEach(function (seed) {
                var originalURL;
                var fileGroup = (_.find(groupOfFiles, function (files) {
                    return files[0].sourceURL === seed.picture_url
                }));

                fileGroup.forEach(function (file) {
                    if (file.data.Location.indexOf('original') !== -1)
                        originalURL = file.data.Location;
                });

                seed.picture_url = originalURL;
            });

            return knex('locations').insert(locationSeeds);
        });
    })
    .then(function () {
        var mediaSeeds = [{ name: 'Five', description: 'Five est une comédie française écrite et réalisée par Igor Gotesman, sortie en 2016.', theater_release_date: new Date(Date.UTC(2016, 3, 30)), tv_release_date: new Date(Date.UTC(2017, 1, 1)), duration: 120, poster_url: 'http://fr.web.img3.acsta.net/pictures/16/01/18/12/47/335908.jpg', poster_alt: 'Five', poster_title: 'Five - un film à voir entre amis', video_url: '9Lij2vKRCBc', video_caption: 'Five, un film à voir entre amis !', synopsis: 'Cinq amis d\'enfance rêvent depuis toujours d\'habiter en colocation. Lorsque l\'occasion d\'emménager ensemble se présente, Julia, Vadim, Nestor et Timothée n\'hésitent pas une seule seconde, surtout quand Samuel se propose de payer la moitié du loyer ! A peine installés, Samuel se retrouve sur la paille mais décide de ne rien dire aux autres et d\'assumer sa part en se mettant à vendre de l\'herbe. Mais n\'est pas dealer qui veut et quand tout dégénère, Samuel n\'a d\'autres choix que de se tourner vers la seule famille qu\'il lui reste : ses amis !', tv_broadcaster: 'Canal+', /*media_genre_id: 8,*/ release_country: 'France', is_published: true },
            { name: 'War Dogs', description: 'Basé sur une histoire vraie de deux jeunes hommes, David Packouz et Efraim Diveroli, qui ont gagné 300 millions de dollars de contrat avec le Pentagone des Etats-Unis pour armer les alliées de l\'Amérique en Afghanistan', theater_release_date: new Date(Date.UTC(2016, 9, 14)), duration: 114, poster_url: 'http://media.senscritique.com/media/000014746561/source_big/War_Dogs.jpg', poster_alt: 'War Dogs', poster_title: 'War Dogs', video_url: 'jJWa0cBN4Ww', synopsis: 'Deux copains âgés d\'une vingtaine d\'années vivant à Miami Beach à l\'époque de la guerre en Irak, profitent d\'un dispositif méconnu du gouvernement fédéral, permettant à de petites entreprises de répondre à des appels d\'offres de l\'armée américaine. Si leurs débuts sont modestes, ils ne tardent pas à empocher de grosses sommes d\'argent et à mener la grande vie. Mais les deux amis sont totalement dépassés par les événements lorsqu\'ils décrochent un contrat de 300 millions de dollars destiné à armer les soldats afghans. Car, pour honorer leurs obligations, ils doivent entrer en contact avec des individus très peu recommandables… dont certains font partie du gouvernement américain…', /*media_genre_id: 8,*/ release_country: 'USA', is_published: true }];

        return Promise.all(mediaSeeds.map(function (seed) {
            return helper.uploadImagesToS3({ body: seed }, 'poster_url', ['name'], 'medias');
        }))
        .then(function (groupOfFiles) {
            mediaSeeds.forEach(function (seed) {
                var originalURL;
                var fileGroup = (_.find(groupOfFiles, function (files) {
                    return files[0].sourceURL === seed.poster_url
                }));

                fileGroup.forEach(function (file) {
                    if (file.data.Location.indexOf('original') !== -1)
                        originalURL = file.data.Location;
                });

                seed.poster_url = originalURL;
            });

            return knex('video_medias').insert(mediaSeeds);
        });        
    })
    .then(function () {
        var productSeeds = [{ name: 'Chemise bleue motif bandana', description: 'Chemise manches courtes en coton bleu. Motif bandana.', picture_url: 'http://www.govdenim.com/10448-thickbox_default/chemise-homme-bleu-motif-bandana-gov-denim-vd9983.jpg', picture_alt: 'Chemise bleue motif bandana', picture_title: 'Chemise bleue motif bandana', commercial_url: 'http://www.govdenim.com/chemise/705-chemise-homme-bleu-motif-bandana-gov-denim-vd9983.html', price: 19.00, brand_id: 1, brand_name: 'GOV Denim', is_published: true },
            { name: 'Veste Rasta Reggae Rock Conquering Lion of Juda', description: 'Veste de marque Jah Star 100% polyester, logo bordé sur la poitrine et imprimé au dos.', picture_url: 'http://i2.cdscdn.com/pdt2/8/3/2/1/550x550/mp03381832/rw/veste-rasta-reggae-rock-conquering-lion-of-juda.jpg', picture_alt: 'Veste Rasta Reggae Rock Conquering Lion of Juda', picture_title: 'Veste Rasta Reggae Rock Conquering Lion of Juda', commercial_url: 'http://www.cdiscount.com/pret-a-porter/derniers-arrivages/veste-rasta-reggae-rock-conquering-lion-of-juda/f-11331-mp03381832.html', price: 24.90, brand_id: 2, brand_name: 'Jah-Star', is_published: true },
            { name: 'Chapeau reversible camo', description: 'Bob réversible - laurier brodé. Un côté motif camouflage. L\'autre de couleur beige.', picture_url: 'http://www.londonstyl.fr/12521-thickbox_default/chapeau-fred-perry-reversible-camo.jpg', picture_alt: 'Chapeau reversible camo', picture_title: 'Chapeau reversible camo', commercial_url: 'http://www.londonstyl.fr/garcons-accessoires/11268-chapeau-fred-perry-reversible-camo.html?codesf=4821759757&gclid=Cj0KEQjwgJq-BRCFqcLW8_DU9agBEiQAz8Koh2VbNUifTOsfo-FC2iexbEskVP1AVIduSidk4Mrco8QaAttH8P8HAQ', price: 39.90, brand_id: 3, brand_name: 'Fred Perry', is_published: true },
            { name: 'WEZEN 1013', description: 'Lunettes de Soleil Femme Monture Aviateur en Métal. Verres 100% UVA/UVB.', picture_url: 'http://media.forzieri.com/i/forzieri/rc470216-002-00-1x?$z$', picture_alt: 'WEZEN 1013 - Lunettes de soleil femme', picture_title: 'WEZEN 1013 - Lunettes de soleil femme', commercial_url: 'http://www.fr.forzieri.com/lunettes-de-soleil/roberto-cavalli/rc470216-002-00?type=prodfeed&camp=zanox_fr&source=zanox&zanpid=2206064293517362176', price: 240.00, brand_id: 4, brand_name: 'Roberto Cavalli', is_published: true },
            { name: 'Blouson style aviateur satiné MA1', description: 'Blouson style aviateur, satiné brillant, doté de poches à pression et de poignets côtelés avec rayures contrastantes.', picture_url: 'http://static.galerieslafayette.com/media/375/37518649/G_37518649_385_ZP_1.jpg', picture_alt: 'Blouson style aviateur satiné MA1', picture_title: 'Blouson style aviateur satiné MA1', commercial_url: 'http://www.galerieslafayette.com/p/blouson+style+aviateur+satine+ma1-topshop/37518649/385', price: 42.00, brand_id: 6, brand_name: 'Topshop', is_published: true },
            { name: 'Blouson esprit Teddy', description: 'Écusson, col, poignets et taille en bord-côtes contrastés, tous les codes du Teddy sont respectés dans ce blouson Wap Two pour homme. On aime l\'allure american college plus tendance que jamais cette saison. On le porte avec un chino et des sneakers pour un look étudiant preppy. En version James Dean ou Marlon Brando, on optera pour un jean brut et t-shirt blanc à col rond.', picture_url: 'http://media.lahalle.com/media-248/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/e/Q/gilet-molleton-418_la-halle-d67a8ff0e37d00a8d6738fbbb0db5507-a.jpg', picture_alt: 'Blouson esprit Teddy', picture_title: 'Blouson esprit Teddy', commercial_url: 'http://www.lahalle.com/product-id/576501#article=576272', price: 23.99, brand_id: 11, brand_name: 'Wap Two', is_published: true },
            { name: 'iPhone 6s gris', description: 'Dès l\'instant où vous utilisez l\'iPhone 6s, vous découvrez des sensations inédites. D\'une simple pression, 3D Touch vous ouvre un champ des possibles insoupçonné. Live Photos donne vie à vos souvenirs. Et ce n\'est qu\'un début. Les innovations de l\'iPhone 6s n\'auront de cesse de vous étonner.', picture_url: 'http://store.storeimages.cdn-apple.com/4973/as-images.apple.com/is/image/AppleInc/aos/published/images/i/ph/iphone6/select/iphone6-select-2014_GEO_US?wid=1200&hei=630&fmt=jpeg&qlt=95&op_sharpen=0&resMode=bicub&op_usm=0.5,0.5,0,0&iccEmbed=0&layer=comp&.v=cAxkZ1', picture_alt: 'Apple iPhone 6s gris', picture_title: 'Apple iPhone 6s gris', commercial_url: 'http://www.apple.com/fr/shop/buy-iphone/iphone6s', price: 749.00, brand_id: 7, brand_name: 'Apple', is_published: true },
            { name: 'Polo slim fit en petit piqué uni', description: 'Essentiel incontournable du vestiaire de saison, ce polo est confectionné dans l\'iconique petit piqué de coton Lacoste. Parfait avec un chino en toile de coton et une paire de sneakers de la collection.', picture_url: 'http://static1.lacoste.com/aaqm_prd/on/demandware.static/Sites-FR-Site/Sites-master/fr/dw59a26dd1/PH4012_031_24.jpg', picture_alt: 'Polo Lacoste slim fit en petit piqué uni', picture_title: 'Polo Lacoste slim fit en petit piqué uni', commercial_url: 'http://www.lacoste.com/fr/lacoste/homme/vetements/polos/polo-lacoste-slim-fit-en-petit-pique-uni/PH4012-00.html?dwvar_PH4012-00_color=031', price: 95.00, brand_id: 5, brand_name: 'Lacoste', is_published: true },
            { name: 'Domoclip DOM171', description: 'Bol mixeur blender: 500 Watt, 1.5L, Patins anti-dérapants...', picture_url: 'http://static.fnac-static.com/multimedia/Images/FR/MC/7a/1e/c7/13049466/1507-1.jpg', picture_alt: 'Domoclip DOM171 - Robot de cuisine', picture_title: 'Domoclip DOM171 - Robot de cuisine', commercial_url: 'http://www.fnac.com/mp13049466/Domoclip-DOM171-Bol-mixeur-blender/w-4', price: 39.29, brand_id: 12, brand_name: 'Domoclip', is_published: true },
            { name: 'iMac', description: 'Depuis toujours, l\'iMac utilise et perfectionne les toutes dernières technologies, afin d\'être en mesure de s\'améliorer sans cesse. L\'écran Retina est le meilleur témoignage de cette philosophie. Apple a repoussé une à une les limites en matière de densité des pixels, pour que tout s\'affiche avec une précision chirurgicale. Ils ont remis en question les méthodes de design intégré existantes, pour atteindre un niveau remarquable de rationalisation et de finition. Résultat : un superbe écran d\'une prodigieuse finesse. Une explosion de couleurs et de contraste. Sans compromis.', picture_url: 'http://store.storeimages.cdn-apple.com/4662/as-images.apple.com/is/image/AppleInc/aos/published/images/I/MA/IMAC/IMAC?wid=1200&hei=630&fmt=jpeg&qlt=95&op_sharpen=0&resMode=bicub&op_usm=0.5,0.5,0,0&iccEmbed=0&layer=comp&.v=dSMkx2', picture_alt: 'Apple iMac', picture_title: 'Apple iMac', commercial_url: 'http://www.apple.com/fr/shop/buy-mac/imac', price: 1249.00, brand_id: 7, brand_name: 'Apple', is_published: true },
            { name: 'Casquette LA grise', description: 'Casquette LA grise à visière plate et autocollant officiel sur la visière. Logos LA et New Era brodés en blanc. Matière: 100% polyester', picture_url: 'http://www.headict.com/img/products2/product/ERANOS0021_5,new-era,casquette-la-grise.jpg', picture_alt: 'Casquette LA grise', picture_title: 'Casquette LA grise', commercial_url: 'http://www.headict.com/fr/6490-casquette-la-grise.html', price: 35.00, brand_id: 13, brand_name: 'New Era', is_published: true },
            { name: 'Macbook Air', description: 'Fin, léger, puissant et prêt pour tout.', picture_url: 'http://images.apple.com/euro/macbook-air/c/generic/images/overview_wireless_hero_enhanced.png', picture_alt: 'Apple Macbook Air', picture_title: 'Apple Macbook Air', commercial_url: 'http://www.apple.com/fr/shop/buy-mac/macbook-air', price: 999.00, brand_id: 7, brand_name: 'Apple', is_published: true },
            { name: 'AMG GT', description: 'Le nouveau Mercedes AMG-GT associe un langage stylistique unique, un intérieur luxueux et des performances impressionnantes. La preuve? Son moteur V8 biturbo AMG de 4,0 litres, qui déploie 375 kW (510 ch) propulsent la voiture de 0 à 100 km/h en 3,8 secondes pour la version GT S (Mercedes-AMG GT 340 kW (462 ch) et 4 secondes). Poussée d\'adrénaline garantie !', picture_url: 'http://www.petites-observations-automobile.com/wp-content/uploads/2014/09/Mercedes-AMG-GT-Carscoops27.jpg', picture_alt: 'Mercedes AMG GT', picture_title: 'Mercedes AMG GT', commercial_url: 'http://www.mercedes-benz.fr/content/france/mpc/mpc_france_website/fr/home_mpc/passengercars/home/new_cars/models/mercedes_amg_gt/c190.html', price: 150000, brand_id: 9, brand_name: 'Mercedes', is_published: true },
            { name: 'C5', description: 'Lignes aérodynamiques, silhouette puissante, courbes élégantes : le design statutaire de votre Citroën C5 fait référence dans la catégorie des berlines. Dès le premier regard, elle suscite l\'émotion et prend, selon les angles de vues, l\'allure d\'un coupé racé ou d\'une berline élégante.', picture_url: 'http://media.citroen.fr/image/72/9/0mm00n9v-1cx7a4sj2mzza0cz-zzzzzzzz-001-01.6729.png', picture_alt: 'Citroën C5', picture_title: 'Citroën C5', commercial_url: 'http://www.citroen.fr/vehicules-neufs/citroen/citroen-c5.html', price: 31400.00, brand_id: 10, brand_name: 'Citröen', is_published: true },
            { name: 'AIR MAX TAVAS', description: 'La chaussure Nike Air Max Tavas pour Homme rappelle la coupe rétro de l\'emblématique modèle de running original avec une unité Max Air au talon et une semelle extérieure à motif gaufré pour une adhérence optimale sur différentes surfaces. Les revêtements sans coutures recouvrant l\'empeigne en mesh et en daim procurent un style moderne et un confort innovant.', picture_url: 'http://images.nike.com/is/image/DotCom/PDP_HERO/NIKE-AIR-MAX-TAVAS-705149_406_A_PREM.jpg?wid=1860&hei=1860&fmt=jpeg&qlt=85&bgc=F5F5F5', picture_alt: 'Nike AIR MAX TAVAS', picture_title: 'Nike AIR MAX TAVAS', commercial_url: 'http://store.nike.com/fr/fr_fr/pd/chaussure-air-max-tavas-pour/pid-11046650/pgid-10295664', price: 120.00, brand_id: 14, brand_name: 'Nike', is_published: true },
            { name: 'Quattroporte', description: 'La Maserati Quattroporte est une berline de grand tourisme du constructeur italien Maserati. Quattroporte en italien signifie littéralement « quatre portes ». Il y a eu, à ce jour, six générations de ce modèle.', picture_url: 'http://images.hgmsites.net/med/2008-maserati-quattroporte_100180896_m.jpg', picture_alt: 'Maserati Quattroporte', picture_title: 'Maserati Quattroporte', commercial_url: 'http://www.lacentrale.fr/occasion-voiture-modele-maserati-quattroporte.html', price: 25000.00, brand_id: 8, brand_name: 'Maserati', is_published: true },
            { name: 'Casquette LA bleue', description: 'Casquette LA bleue forme 59fifty à visière plate. Logo LA blanc brodé et autocollant officiel collé sur la visière.', picture_url: 'http://www.headict.com/img/products2/product/ERANOS0025_5,new-era,casquette-la-bleu-noir.jpg', picture_alt: 'Casquette LA bleue', picture_title: 'Casquette LA bleue', commercial_url: 'http://www.headict.com/fr/4794-casquette-la-bleu-noir.html', price: 35.00, brand_id: 13, brand_name: 'New Era', is_published: true },
            { name: 'Ottoman cuir vachette', description: 'Pouf cuir très agréable avec ressort résistants. Le cuir de vachette apporte douceur et résistance.', picture_url: 'https://www.beliani.fr/images/cache/french_src_saved_saved_id_14509_picid_119686_x_1000_nochange_1_image.jpg', picture_alt: 'Ottoman Beliani', picture_title: 'Ottoman Beliani', commercial_url: 'https://www.beliani.fr/meubles-de-salon/canapes-en-cuir/poof-repose%20pied-vintage-cuir-adam.html', price: 899.00, brand_id: 15, brand_name: 'Beliani', is_published: true },
            { name: 'Maitresse', description: 'Tabouret de bar oldschool et sobre. Parfait pour recevoir des amis autour d\'un verre. Piètement métallique et assise en bois.', picture_url: 'http://www.drawer.fr/8776-thickbox_default/lot-de-2-tabourets-de-bar-vintage-maitresse.jpg', picture_alt: 'Tabouret maitresse par Drawer', picture_title: 'Tabouret maitresse par Drawer', commercial_url: 'http://www.drawer.fr/tabouret-bar/600764-lot-de-2-tabourets-de-bar-vintage-maitresse-3700820505521.html', price: 149.90, brand_id: 17, brand_name: 'Drawer', is_published: true },
            { name: 'HD 4618/20', description: 'La fonction « indicateur 1 tasse » de cette mini-bouilloire électrique Philips HD4618/20 vous permet de ne chauffer que la quantité d\'eau nécessaire. Vous pouvez ainsi économiser jusqu\'à 50 % d\'énergie très facilement et réduire votre impact sur l\'environnement.', picture_url: 'http://images.philips.com/is/image/PhilipsConsumer/HD4618_20-IMS-fr_FR?wid=494&hei=435&$pnglarge$', picture_alt: 'Bouilloire Philips HD 4618/20', picture_title: 'Bouilloire Philips HD 4618/20', commercial_url: 'http://www.philips.fr/c-p/HD4618_20/mini-bouilloire', price: 39.90, brand_id: 16, brand_name: 'Philips', is_published: true },
            { name: 'Aviator', description: 'Avec un style aviateur identifiable, ces lunettes sont fabriqués dans un matériau léger, résistant aux rayures et possèdent la signature G ainsi que les bandes. Disponibles en couleur Havana sombre et verres teintés dégradés.', picture_url: 'https://images-na.ssl-images-amazon.com/images/I/51o2LawV8jL._UL1500_.jpg', picture_alt: 'Lunettes de soleil Gucci Aviator', picture_title: 'Lunettes de soleil Gucci Aviator', commercial_url: 'https://www.amazon.fr/Gucci-1622-Aviator-Sunglasses/dp/B002T0YAW8', price: 157.79, brand_id: 18, brand_name: 'Gucci', is_published: true },
            { name: 'HOT/S', description: 'Découvrez ces lunettes de soleil Carrera HOT/S couleur havana et verres teintés au look aviateur très marqué.', picture_url: 'https://images-na.ssl-images-amazon.com/images/I/71w4cEpTvrL._UL1500_.jpg', picture_alt: 'Lunettes de soleil Carrera HOT/S', picture_title: 'Lunettes de soleil Carrera HOT/S', commercial_url: 'https://www.amazon.fr/Carrera-Lunettes-soleil-130mm-GREENHAVANA/dp/B002AJ84LG/ref=sr_1_fkmr0_1', price: 98.18, brand_id: 20, parent_product_id: 21, brand_name: 'Carrera', is_published: true },
            { name: 'Terry SQUARE', description: 'Découvrez ces lunettes de soleil Tom Ford Terry Square couleur havana et verres teintés au look aviateur très marqué.', picture_url: 'http://cdn1.smartbuyglasses.com/public/images/designer_sunglasses/Tom%20Ford/Tom%20Ford%20FT0332%20TERRY%2056P.jpg', picture_alt: 'Lunettes de soleil Tom Ford TERRY SQUARE', picture_title: 'Lunettes de soleil Tom Ford TERRY SQUARE', commercial_url: 'http://www.easylunettes.fr/lunettes-de-soleil-design/Tom-Ford/Tom-Ford-FT0332-TERRY-56P-224597.html', price: 175.95, brand_id: 19, parent_product_id: 21, brand_name: 'Tom Ford', is_published: true },
            { name: 'Écharpe tricotée jacquard motif GG', description: 'Echarpe marron clair avec bande vert/rouge/vert. Largeur de 35cm, hauteu de 180cm. 80% laine et 20% soie jacquard. Fabriqué en Italie', picture_url: 'https://media.gucci.com/style/DarkGray_Center_0_0_2400x2400/1439376067/147351_4G704_2766_001_100_0000_Light-charpe-tricote-jacquard-motif-GG.jpg', picture_alt: 'Écharpe tricotée Gucci jacquard motif GG', picture_title: 'Écharpe tricotée Gucci jacquard motif GG', commercial_url: 'https://www.gucci.com/fr/fr/pr/men/mens-accessories/mens-scarves/mens-scarves/gg-jacquard-knit-scarf-with-web-p-1473514G7042766', price: 220.00, brand_id: 18, brand_name: 'Gucci', is_published: true },
            { name: 'Veste entraînement running', description: 'Veste nike de running en polyester. Légère et respirante pour vos futures séances d\'entraînement.', picture_url: 'https://images-na.ssl-images-amazon.com/images/I/51hNhf89%2BqL._SL1000_.jpg', picture_alt: 'Veste running Nike noire et jaune fluo', picture_title: 'Veste running Nike noire et jaune fluo', commercial_url: 'https://www.amazon.com/Nike-Track-Jacket-Style-502643/dp/B009GJVA9G', price: 60.00, brand_id: 14, brand_name: 'Nike', is_published: true },
            { name: 'Submariner boîtier Oyster', description: 'La robustesse, la fonctionnalité et l\'esthétique de la Submariner en ont rapidement fait une montre emblématique. Équipées d\'un boîtier Oyster subtilement retravaillé, d\'un cadran reconnaissable avec de larges repères horaires luminescents, d\'une lunette tournante graduée Cerachrom et d\'un robuste bracelet Oyster, les dernières générations de Submariner et Submariner Date sont dans la lignée directe du modèle original lancé en 1953.', picture_url: 'https://content.rolex.com/is/image/Rolex/?src=is%7BRolex%2Fshadow_oyster_submariner_40%3Flayer%3D1%26src%3D41315%26layer%3D2%26src%3D42290_g_40%26layer%3D3%26src%3D41343%7D&$rv55-watch$', picture_alt: 'Rolex Submariner Oyster', picture_title: 'Rolex Submariner Oyster', commercial_url: 'https://www.rolex.com/fr/watches/submariner/m114060-0002.html', price: 6850.00, brand_id: 25, brand_name: 'Rolex', is_published: true },
            { name: 'ROVIC ZIP 3D TAPERED - Pantalon cargo', description: '', picture_url: 'https://mosaic02.ztat.net/nvg/media/large/GS/12/2E/03/DN/11/GS122E03D-N11@14.jpg', picture_alt: 'Pantalon cargo G-Star Raw kaki', picture_title: 'Pantalon cargo G-Star Raw kaki', commercial_url: 'https://www.zalando.fr/g-star-rovic-zip-3d-tapered-pantalon-cargo-gs122e03d-n11.html', price: 99.95, brand_id: 23, brand_name: 'G-Star Raw', is_published: true },
            { name: 'GSHOCK - DW-D5600P-1JF', description: 'Montre à boitier ultra résistant utilisable dans les conditions les plus difficiles.', picture_url: 'https://images-na.ssl-images-amazon.com/images/I/81fhS4oaQjL._UL1500_.jpg', picture_alt: 'Casio GSHOCK - DW-D5600P-1JF', picture_title: 'Casio GSHOCK - DW-D5600P-1JF', commercial_url: 'https://www.amazon.fr/dp/B00JRKD7A4/ref=olp_product_details', price: 256.00, brand_id: 24, brand_name: 'Casio', is_published: true },
            { name: 'Blouson de survêtement Ferrari', description: 'Avec ce sweat de PUMA x Scuderia Ferrari, tu apportes le sport automobile directement dans tes loisirs. Manches raglan avec bande T7 en élément tissé. Col montant. Poches zippées. 100 % en polyester.', picture_url: 'http://gpmini.qc.ca/store/images/ApparelF1/76106601A.jpg', picture_alt: 'Blouson de survêtement Puma Ferrari', picture_title: 'Blouson de survêtement Puma Ferrari', commercial_url: 'http://fr.puma.com/fr/fr/pd/blouson-de-surv%C3%AAtement-ferrari-pour-homme/761981.html?dwvar_761981_color=Puma%20Black#start=1', price: 90.00, brand_id: 26, brand_name: 'Puma', is_published: true },
            { name: 'Sweat à capuche gris', description: 'Sweat à capuche pour vos séances d\'entrainement. 80% Coton, 20% Polyester. Manches longues.', picture_url: 'https://images-na.ssl-images-amazon.com/images/I/61ynE9To04L._UL1500_.jpg', picture_alt: 'Sweat à capuche gris Fruit of the Loom', picture_title: 'Sweat à capuche gris Fruit of the Loom', commercial_url: 'https://www.amazon.fr/Fruit-Loom-Sweat-capuche-moyen/dp/B004X2BQ0Y', price: 27.00, brand_id: 22, brand_name: 'Fruit of The Loom', is_published: true },
            { name: 'Costume en Sergé de laine gris clair', description: 'Costume « Soho » homme à deux boutons gris clair, coupe ajustée. Fabriqué en Italie avec du fil à forte torsion 100 % laine, qui confère au tissu une très bonne résistance et le rend peu froissable. Ce tissu possède également des qualités hydrofuges. Ce costume présente une veste avec un revers à cran et une doublure en laine Melton au col. Pantalon assorti, sans pinces.', picture_url: 'http://www.paulsmith.fr/media/catalog/product/cache/9/image/600x/9df78eab33525d08d6e5fb8d27136e95/p/p/ppxl-1439-p20w-l.jpg', picture_alt: 'Costume Paul Smith En Sergé De Laine Gris Clair', picture_title: 'Costume Paul Smith En Sergé De Laine Gris Clair', commercial_url: 'http://www.paulsmith.fr/a-suit-to-travel-in-tailored-fit-light-grey-wool-twill-suit.html', price: 995.00, brand_id: 21, brand_name: 'Paul Smith', is_published: true }];
        var productSeedsCopy = JSON.parse(JSON.stringify(productSeeds));

        productSeeds.forEach(function(seed){
            delete seed.brand_name;
        });

        return Promise.all(productSeedsCopy.map(function(seed) {       
            return helper.uploadImagesToS3({body: seed}, 'picture_url', ['name', 'brand_name'], 'products');          
        }))
        .then(function (groupOfFiles) {            
            productSeeds.forEach(function (seed) {
                var originalURL;
                var fileGroup = (_.find(groupOfFiles, function (files) {
                    return files[0].sourceURL === seed.picture_url
                }));                

                fileGroup.forEach(function (file) {
                    if (file.data.Location.indexOf('original') !== -1)
                        originalURL = file.data.Location;
                });
               
                seed.picture_url = originalURL;
            });

            return knex('products').insert(productSeeds);
        });                
    })
    .then(function () {
        var setSeeds = [{ name: 'Salon de la coloc\'', description: 'Salon de l\'appartement du film Five, où les cinq protagonistes du film découvrent la vie en collocation.', picture_url: 'https://s3.eu-central-1.amazonaws.com/in-movies/assets/five-la-coloc.jpg', picture_alt: 'Salon de la coloc\'', picture_title: 'Salon de la coloc\'', place: 'Paris - France', time_codes: [104], video_media_id: 1, is_published: true }];
        
        return Promise.all(setSeeds.map(function (seed) {
            return helper.uploadImagesToS3({ body: seed }, 'picture_url', ['name'], 'sets');
        }))
        .then(function (groupOfFiles) {
            setSeeds.forEach(function (seed) {
                var originalURL;
                var fileGroup = (_.find(groupOfFiles, function (files) {
                    return files[0].sourceURL === seed.picture_url
                }));

                fileGroup.forEach(function (file) {
                    if (file.data.Location.indexOf('original') !== -1)
                        originalURL = file.data.Location;
                });

                seed.picture_url = originalURL;
            });

            return knex('sets').insert(setSeeds);
        });
    })
    .then(function () {
        return knex('looks').insert([{ name: 'Look de Julia', description: 'Retrouvez le look de Julia dans la scène au jardin du Luxembourg', time_codes: [4], media_character_id: 4, video_media_id: 1, is_published: true },
        { name: 'Look de Timothée', description: 'Retrouvez le look de Timothée dans la scène au jardin du Luxembourg', time_codes: [4], media_character_id: 2, video_media_id: 1, is_published: true }]);
    }).then(function () {
        return Promise.join(

        //knex('categories_products')
        knex('products_tags')
        .insert([{ product_id: 1, tag_id: 10 },
            { product_id: 2, tag_id: 8 },
            { product_id: 3, tag_id: 32 },
            { product_id: 4, tag_id: 57 },
            { product_id: 5, tag_id: 40 },
            { product_id: 6, tag_id: 8 },
            { product_id: 7, tag_id: 96 },
            { product_id: 8, tag_id: 7 },
            { product_id: 9, tag_id: 96 },
            { product_id: 10, tag_id: 96 },
            { product_id: 11, tag_id: 32 },
            { product_id: 12, tag_id: 96 },
            { product_id: 13, tag_id: 98 },
            { product_id: 14, tag_id: 98 },
            { product_id: 15, tag_id: 21 },
            { product_id: 16, tag_id: 98 },
            { product_id: 17, tag_id: 32 },
            { product_id: 21, tag_id: 31 },
            { product_id: 22, tag_id: 31 },
            { product_id: 23, tag_id: 31 },
            { product_id: 24, tag_id: 30 },
            { product_id: 25, tag_id: 8 },
            { product_id: 26, tag_id: 28 },
            { product_id: 27, tag_id: 14 },
            { product_id: 28, tag_id: 28 },
            { product_id: 29, tag_id: 8 },
            { product_id: 30, tag_id: 12 },
            { product_id: 31, tag_id: 16 }]),

        //knex('categories_video_medias')
        knex('tags_video_medias')
        .insert([{ video_media_id: 1, tag_id: 105 },
        { video_media_id: 1, tag_id: 113 },
        { video_media_id: 2, tag_id: 105 },
        { video_media_id: 2, tag_id: 113 },
        { video_media_id: 2, tag_id: 127 }]),

        //knex('categories_locations')
        knex('locations_tags')
        .insert([{ location_id: 1, tag_id: 102 },
        { location_id: 2, tag_id: 102 }]),

        //knex('categories_looks')
        knex('looks_tags')
        .insert([{ look_id: 1, tag_id: 103 },
        { look_id: 2, tag_id: 103 }]),

        //knex('categories_sets')
        knex('sets_tags')
        .insert([{ set_id: 1, tag_id: 104 }]),
			
        knex('products_video_medias').insert([{ product_id: 1, video_media_id: 1, matching_status_id: 2, time_codes: [4], appearing_context: 'Nestor porte une chemise bleue à motifs bandana dans la scène du jardin du Luxembourg.' },
        { product_id: 6, video_media_id: 1, matching_status_id: 2, time_codes: [8], appearing_context: 'Timothée porte un blouson bleu type universitaire américain dans les rues de Paris.' },
        { product_id: 7, video_media_id: 1, matching_status_id: 1, time_codes: [19], appearing_context: 'Samuel tient dans sa main son iPhone6s pendant une discussion avec son père.' },
        { product_id: 8, video_media_id: 1, matching_status_id: 1, time_codes: [19], appearing_context: 'Samuel porte un polo Lacoste noir pendant une discussion avec son père.' },
        { product_id: 9, video_media_id: 1, matching_status_id: 2, time_codes: [19], appearing_context: 'On peut apercevoir un blender américain dans le fond de la scène où Samuel discute avec père.' },
        { product_id: 10, video_media_id: 1, matching_status_id: 2, time_codes: [20], appearing_context: 'Vadim utilise son iMac afin de retoucher une photo de Samuel.' },
        { product_id: 11, video_media_id: 1, matching_status_id: 1, time_codes: [37], appearing_context: 'Vadim porte une casquette LA grise.' },
        { product_id: 12, video_media_id: 1, matching_status_id: 1, time_codes: [37], appearing_context: 'On aperçoit Nestor utiliser un Apple Macbook Air sur le canapé de son appartement.' },
        { product_id: 13, video_media_id: 1, matching_status_id: 1, time_codes: [52], appearing_context: 'Une mercedes AMG GT déboule à toute vitesse dans les rues de Paris.' },
        { product_id: 14, video_media_id: 1, matching_status_id: 1, time_codes: [54], appearing_context: 'Samuel et Timothée arrive dans la cité avec une Citroën C5 grise.' },
        { product_id: 15, video_media_id: 1, matching_status_id: 2, time_codes: [60], appearing_context: 'Samuel porte une paire de Nike du moment.' },
        { product_id: 16, video_media_id: 1, matching_status_id: 1, time_codes: [71], appearing_context: 'On aperçoit une Maserati Quattroporte se garer en premier plan.' },
        { product_id: 17, video_media_id: 1, matching_status_id: 1, time_codes: [82], appearing_context: 'Vadim porte une casqueet LA bleue.' },
        { product_id: 21, video_media_id: 2, matching_status_id: 1, time_codes: [46], appearing_context: 'Efraim porte ces lunettes dans de nombreuses scènes du film.' },        
        { product_id: 24, video_media_id: 2, matching_status_id: 1, time_codes: [94], appearing_context: 'Efraim porte une écharpe lors de ces essais de tir à la Kalachnikov.' },
        { product_id: 25, video_media_id: 2, matching_status_id: 2, time_codes: [67], appearing_context: 'Efraim porte un haut de survêtement similaire dans plusieurs scènes du film.' },
        { product_id: 26, video_media_id: 2, matching_status_id: 1, time_codes: [32], appearing_context: 'Tout au long du film Efraim ne quitte pratiquement jamais sa Rolex submariner.' },
        { product_id: 27, video_media_id: 2, matching_status_id: 2, time_codes: [105], appearing_context: 'David porte se pantalon style cargo lors des scènes à l\'étranger, dans les situations dangeureuses.' },
        { product_id: 28, video_media_id: 2, matching_status_id: 2, time_codes: [105], appearing_context: 'Cette montre accompagne David lorsqu\'il est en zone de guerre.' },
        { product_id: 29, video_media_id: 2, matching_status_id: 2, time_codes: [51], appearing_context: 'On peut apercevoir Efraim porter un haut de survêtement de ce type.' },
        { product_id: 30, video_media_id: 2, matching_status_id: 2, time_codes: [91], appearing_context: 'David fait son footing avec ce type de sweat à capuche.' },
        { product_id: 31, video_media_id: 2, matching_status_id: 2, time_codes: [10], appearing_context: 'David porte un costume similaire lors des scènes business du film.' }]),

        knex('video_medias_workers')
        .insert([{ worker_id: 1, video_media_id: 1, worker_type_id: 1 },
        { worker_id: 1, video_media_id: 1, worker_type_id: 2 },
        { worker_id: 2, video_media_id: 1, worker_type_id: 2 },
        { worker_id: 3, video_media_id: 1, worker_type_id: 2 },
        { worker_id: 4, video_media_id: 1, worker_type_id: 2 },
        { worker_id: 5, video_media_id: 1, worker_type_id: 2 },
        { worker_id: 6, video_media_id: 1, worker_type_id: 3 },
        { worker_id: 7, video_media_id: 1, worker_type_id: 3 },
        { worker_id: 8, video_media_id: 1, worker_type_id: 4 },
        { worker_id: 9, video_media_id: 1, worker_type_id: 5 },
        { worker_id: 10, video_media_id: 1, worker_type_id: 6 },
        { worker_id: 11, video_media_id: 2, worker_type_id: 6 },
        { worker_id: 12, video_media_id: 2, worker_type_id: 6 }]),
            
        knex('locations_video_medias')
        .insert([{ appearing_context: 'Les cinq collocataires du film Five se retrouvent dans le jardin du Luxembourg pour passer du bon temps. La scène se déroule aux alentours du manège du jardin.', time_codes: [2, 34], location_id: 1, video_media_id: 1 },
        { appearing_context: 'Efraim et David ont rendez-vous au Pentagone afin de finaliser le contrat d\'armement signé avec le gouvernement des Etats-Unis', time_codes: [2], location_id: 2, video_media_id: 2 }]),

        knex('looks_products')
        .insert([{ matching_status_id: 2, appearing_context: 'Julia porte ses lunettes attaché à sont Tshirt.', order: 1, body_location_id: 1, look_id: 1, product_id: 4 },
        { matching_status_id: 2, appearing_context: 'Julia porte un blouson rose de type universitaire américain dans le jardin du Luxembourg.', order: 1, body_location_id: 2, look_id: 1, product_id: 5 },
        { matching_status_id: 2, appearing_context: 'Timothée porte un bob camo dans la scène du jardin du Luxembourg.', order: 1, body_location_id: 1, look_id: 2, product_id: 3 },
        { matching_status_id: 2, appearing_context: 'Timothée porte une veste type reggae dans la scène du jardin du Luxembourg.', order: 1, body_location_id: 2, look_id: 2, product_id: 2 }]),
        
        knex('products_sets')
        .insert([{ matching_status_id: 2, appearing_context: 'On peut apercevoir un ottoman dans le salon de coloc\' alors que nos collocataires sont en pleine discussion.', x_offset: 580, y_offset: 280, set_id: 1, product_id: 18 },
        { matching_status_id: 1, appearing_context: 'On peut apercevoir des tabourets à pieds fixes dans le salon de coloc\' alors que nos collocataires sont en pleine discussion.', x_offset: 750, y_offset: 200, set_id: 1, product_id: 19 },
        { matching_status_id: 2, appearing_context: 'On peut apercevoir une bouilloire dans le salon de coloc\' alors que nos collocataires sont en pleine discussion.', x_offset: 860, y_offset: 130, set_id: 1, product_id: 20 }]));
    }).then(function () {
        console.log('Seed completed !');
    });
};
