var express = require('express'),
    router = express.Router(),
	Promise = require('bluebird'),
	nodemailer = require('nodemailer'),
	User = require('../models/user');

router.get('/:token', function (req, res, next) {
  User.where('reset_password_token', '=', req.params.token).where('reset_password_expires', '>', new Date()).fetch()
  .then(function(user) {
      if (!user) {
          req.flash('resetMessage', ['danger', 'Votre demande de réinitialisation est erronée ou a expiré. Merci de refaire une demande.']);
          req.session.save(function (err) {
              res.redirect('/');
          });

      } else 
          res.render('reset/reset', { user: req.user });      
  });
})
.post('/:token', function(req, res, next){
	User.where('reset_password_token', '=', req.params.token).where('reset_password_expires', '>', new Date()).fetch()
	.then(function(user) {				
        if (!user) 
          throw new Error('Votre demande de réinitialisation est erronée ou a expiré. Merci de refaire une demande.');       

        user.set({password: req.body.password});
		return user.generateHash();                
	})
	.then(function(user){
		user.set({reset_password_token: null});
        user.set({reset_password_expires: null});

        return user.save();  
	})
	.then(function(user){
		req.logIn(user, function(err) {
            var smtpTransport = nodemailer.createTransport(
			{
				host: 'SSL0.OVH.NET',
				port: 465,
				secure: true, // use SSL
				auth: {
					user: 'erwinfrance@cinalia.com',
					pass: 'JpEf2016CIN'
				}
			});
			var mailOptions = {
				to: user.get('email'),
				from: 'nepasrepondre@cinalia.com',
				subject: 'Votre mot de passe a été réinitialisé',
				text: 'Bonjour,\n\n' +
				  'Nous vous confirmons que le mot de passe de votre compte ' + user.get('email') + ' a été réinitialisé avec succès.\n\n'+
				  'L\'équipe PickedIn.com.'
			};
			smtpTransport.sendMail(mailOptions, function (err) {
				if (err) return next(err);

				req.flash('resetMessage', ['success', 'Félicitations ! Votre mot de passe a été réinitialisé avec succès.']);
				req.session.save(function (err) {
				    res.redirect('/');
				});				
			});
		});
	})
    .catch(function (err) {
        req.flash('resetMessage', ['danger', err.message]);
        req.session.save(function (err) {
            res.redirect('back');
        });
    });
});

module.exports = router;