var nodemailer = require('nodemailer');

module.exports.getPaginationData = function (rowCount, pageSize, paginationLimit, currentPage) {
    var totalPages = Math.ceil(rowCount / (pageSize ? pageSize : 20));
    var pageGroups = Math.ceil(totalPages / (paginationLimit ? paginationLimit : 10));
    items = [];
    var lastPage = totalPages;
    var next = currentPage < lastPage ? currentPage + 1 : 1;
    var prev = currentPage < 2 ? lastPage : currentPage - 1;
    var isFirstPage = currentPage === 1;
    var isLastPage = currentPage === lastPage;
    var highestF = currentPage + 2;
    var lowestF = currentPage - 2;
    var counterLimit = totalPages - 2;

    if (pageGroups > 1) {
        items.push(1);
        items.push(2);
        // if our current page is higher than 3
        if (lowestF > 3) {
            items.push('...');
            //lets check if we our current page is towards the end
            if (lastPage - currentPage < 2) {
                lowestF -= 3; // add more previous links       
            }
        }
        else {
            lowestF = 3; // lowest num to start looping from
        }
        for (var counter = lowestF; counter < lowestF + 5; counter++) {
            if (counter > counterLimit) {
                break;
            }
            items.push(counter);
        }
        // if current page not towards the end
        if (highestF < totalPages - 2) {
            items.push('...');
        }
        items.push(lastPage - 1);
        items.push(lastPage);
    }
    else {
        // no complex pagination required
        for (var counter2 = 1; counter2 <= lastPage; counter2++) {
            items.push(counter2);
        }
    }
    return {
        items: items,
        currentPage: currentPage,
        isFirstPage: isFirstPage,
        isLastPage: isLastPage,
        next: next,
        prev: prev,
        total: rowCount,
        limit: pageSize
    };     
};

module.exports.toURLFormat = function (string) {
    var chars = { "à": "a", "á": "a", "â": "a", "ã": "a", "ä": "a", "å": "a", "ò": "o", "ó": "o", "ô": "o", "õ": "o", "ö": "o", "ø": "o", "è": "e", "é": "e", "ê": "e", "ë": "e", "ç": "c", "ì": "i", "í": "i", "î": "i", "ï": "i", "ù": "u", "ú": "u", "û": "u", "ü": "u", "ÿ": "y", "ñ": "n", "-": "_" };
    return string.replace(/[^A-Za-z0-9]/g, function (x) { return chars[x] || x; }).replace(/\s+/g, '_').toLowerCase();
};

module.exports.setupFlashMessages = function(flashMessages){
	var message = {};
	
	if(flashMessages.signinMessage){
		message.element = {selector: '#signin-form', type: 'nav', actionnable: '#login-toggle'}
		message.style = flashMessages.signinMessage[0];
		message.message = flashMessages.signinMessage[1];
	} else if(flashMessages.signupMessage){
		message.element = {selector: '#signup-form', type: style === 'danger' ? 'modal' : 'notify', actionnable: '#signup-modal'}
		message.style = flashMessages.signupMessage[0];
		message.message = flashMessages.signupMessage[1];
	}else if(flashMessages.forgotMessage){
		var style = flashMessages.forgotMessage[0];
		message.element = {selector: '#forgot-form', type: style === 'danger' ? 'modal' : 'notify', actionnable: '#forgot-modal'}
		message.style = style;
		message.message = flashMessages.forgotMessage[1];
	}else if(flashMessages.resetMessage){
		message.element = {selector: '#flash-message', type: style === 'danger' ? 'form' : 'notify'};
		message.style = flashMessages.resetMessage[0];
		message.message = flashMessages.resetMessage[1];
	}
	
	return message;
};

module.exports.sendMail = function(to, from, subject, text, callback){
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
        to: to,
        from: from,
        subject: subject,
        text: text
    };
    smtpTransport.sendMail(mailOptions, callback);
}