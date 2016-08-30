module.exports = function (req, res, next) {    
    res.locals.captchaKey = process.env.PUBLIC_CAPTCHA_KEY;
    next();
}