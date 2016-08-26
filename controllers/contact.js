var express = require('express'),
    router = express.Router(),
    helper = require('../helpers/helper');
    

router.post('/', function (req, res, next) {
    helper.sendMail('erwinfrance@cinalia.com', 'contact@cinalia.com', '[Prise de contact] ' + req.body.subject,  'Message envoyé par: ' + req.body.from + '\n\n' + req.body.message, function (err) {
        if (err)
            res.json({ status: 'error', message: err.message });
        else
            res.json({ status: 'sent', message: 'Votre message a été envoyé avec succès. Nous tâcherons d\'y répondre dans les plus brefs délais.' });
    });		
});

module.exports = router;