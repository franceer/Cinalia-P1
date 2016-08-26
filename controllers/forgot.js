var express = require('express'),
    router = express.Router(),
    Promise = require('bluebird'),
    User = require('../models/user'),
    nodemailer = require('nodemailer'),
    crypto = require('crypto');

router.post('/', function (req, res, next) {
    let token;
	
	if(!req.body.email){
	    req.flash('forgotMessage', ['danger', 'Vous devez spécifier un email']);
	    req.session.save(function (err) {
	        res.redirect(req.headers.referer);
	    });		
	}else{	
		Promise.resolve()
		.then(function () {
			let promiseRandomBytes = Promise.promisify(crypto.randomBytes);
			return promiseRandomBytes(20);
		})
		.then(function (buffer) {
			token = buffer.toString('hex');
			return User.findOne({ email: req.body.email }, {require: false});
		})
		.then(function (user) {
			if (!user)
				throw new Error('Aucun compte avec l\'adresse renseignée n\'a été trouvé');			

			let currentDate = new Date();
			currentDate.setHours(currentDate.getHours() + 1);
			user.set({ reset_password_token: token, reset_password_expires: currentDate});
			return user.save();
		})
		.then(function (user) {
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
				subject: 'PickedIn.com - Réinitialisation de votre mot de passe',
				text: 'Vous recevez cet e-mail car vous (ou quelqu\'un d\'autre) avez demandé la réinitialisation du mot de passe de votre compte PickedIn.com.\n\n' +
				  'Merci de cliquer sur le lien ci-dessous, ou copiez le dans votre navigateur afin de compléter le processus :\n\n' +
				  'http://' + req.headers.host + '/reset/' + token + '\n\n' +
				  'Si vous n\'avez pas demandé cette réinitialisation, merci de bien vouloir ignorer cet email (votre mot de passe restera inchangé).\n\n' +
				  'L\'équipe PickedIn.com'
			};

			smtpTransport.sendMail(mailOptions, function (err) {
				if (err) return next(err);

				req.flash('forgotMessage', ['info', 'Un e-mail vous a été envoyé à l\'adresse : ' + user.get('email') + ' avec les instructions nécessaire à la réinitialisation de votre mot de passe.']);
				req.session.save(function (err) {
				    return res.redirect(req.headers.referer);
				});
			});
		})    
		.catch(function (err) {
			req.flash('forgotMessage', ['danger', err.message]);
			req.session.save(function (err) {
			    return res.redirect(req.headers.referer);
			});
		});
	}
});

module.exports = router;