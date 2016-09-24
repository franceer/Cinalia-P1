var nodemailer = require('nodemailer'),
    moment = require('moment'),
    Promise = require('bluebird'),
    fs = require('fs'),
    gm = require('gm').subClass({ imageMagick: true }),
    request = require('request'),
    AWS = require('aws-sdk'),
    path = require('path'),
    crypto = require('crypto');

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

module.exports.toURLFormat = toURLFormat;

function toURLFormat(string, separator) {
    var chars = { "à": "a", "á": "a", "â": "a", "ã": "a", "ä": "a", "å": "a", "ò": "o", "ó": "o", "ô": "o", "õ": "o", "ö": "o", "ø": "o", "è": "e", "é": "e", "ê": "e", "ë": "e", "ç": "c", "ì": "i", "í": "i", "î": "i", "ï": "i", "ù": "u", "ú": "u", "û": "u", "ü": "u", "ÿ": "y", "ñ": "n", "-": "_" };
    return string.replace(/[^A-Za-z0-9]/g, function (x) { return chars[x] || x; }).replace(/\s+/g, separator ? separator : '_').toLowerCase();
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

module.exports.uploadImagesToS3 = function (req, imagePropertyName, renameProperties, assetType) {
    var imageURL = req.body[imagePropertyName];
    var extension  = path.extname(imageURL);
    var datePrefix = moment().format('YYYY[/]MM');
    var key = crypto.randomBytes(10).toString('hex');
    var fileName = '';

    renameProperties.forEach(function (propertyName) {
        var subProperties = propertyName.split('.');

        if (subProperties.length > 1)
        {
            var tempObj;
            subProperties.forEach(function (subPropertyName) {
                if (tempObj)
                    tempObj = tempObj[subPropertyName];
                else
                    tempObj = req.body[subPropertyName];
            });

            fileName += (fileName.length === 0 ? '' : ' ') + tempObj;
        } else {
            fileName += (fileName.length === 0 ? '' : ' ') + req.body[propertyName];
        }       
    });

    fileName = toURLFormat(fileName, '-');    
    var pathToFile = process.env.NODE_ENV +'/' + assetType + '/' + datePrefix + '/' + key + '/' + fileName;

    return new Promise(function (resolve, reject) {
        var files = [];

        request({ url: imageURL, encoding: null }, function (error, response, body) {
            if (error)
                reject(error);

            files.push({
                key: pathToFile + '-original' + extension,
                stream: gm(body).resize('640', '480', '>').stream()
            });

            files.push({
                key: pathToFile + '-small' + extension,
                stream: gm(body).resize('253', '198').stream()
            });

            files.push({
                key: pathToFile + '-thumbnail' + extension,
                stream: gm(body).resize('64', '64').stream()
            });

            resolve(files);
        });       
    })
    .then(function (files) {
        var s3 = new AWS.S3({ region: 'eu-central-1', signatureVersion: 'v4' });

        return Promise.all(files.map(function(file) {
            var params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: file.key,
                Body: file.stream,
                ACL: 'public-read'
            };
        
            return new Promise(function(resolve, reject) {
                s3.upload(params, function(err, data) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ sourceURL: imageURL, data: data});
                    }
                }); 
            });            
        }));   
    });  
};

module.exports.deleteS3Objects = function (prefix) {
    var s3 = new AWS.S3({ region: 'eu-central-1', signatureVersion: 'v4' });
    var params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Prefix: prefix + '/'
    };
    
    return new Promise(function (resolve, reject) {
        s3.listObjectsV2(params, function (err, data) {
            if (err)
                reject(err);

            var params2 = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Delete: {
                    Objects: []
                }
            }

            data.Contents.forEach(function (content) {
                params2.Delete.Objects.push({ Key: content.Key });
            });

            s3.deleteObjects(params2, function (err, data) {
                if(err)
                    reject(err)

                resolve(data);
            });
        });
    });
};