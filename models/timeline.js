var pg = require('pg');

//module.exports.get = function (id, callback) {
//    console.log('pouf' + id);
//    callback(null, 'toto');
//}
 //Get a particular timeline
module.exports.get = function(id, callback) {
  // Get a Postgres client from the connection pool    
    var connectionString = 'postgres://postgres:password@localhost:5432/PickedIn';
    
    pg.connect(connectionString, function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        
        var timeline = [];
        client.query('SELECT "video-medias"."title", "MediaProductTimeline"."TimeCodes", "products"."name", "products"."picture-url", "products"."commercial-url" FROM public."video-medias", public."MediaProductTimeline", public."products" WHERE "video-medias"."id" = "MediaProductTimeline"."MediaID" AND "products"."id" = "MediaProductTimeline"."ProductID" AND "video-medias"."id" = $1;', id, function (err, results) {
            //call `done()` to release the client back to the pool
            if (err) {
                return console.error('error running query', err);
            }

            timeline = results.rows;
            done();
            
            
            callback(null, timeline);
            //console.log(result.rows[0].number);
            //output: 1
        });        
    });
}
