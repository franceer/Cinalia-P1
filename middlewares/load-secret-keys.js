module.exports = function (req, res, next) {    
    res.locals.captchaKey = process.env.PUBLIC_CAPTCHA_KEY;
    res.locals.mapsPublicKey = process.env.MAPS_PUBLIC_KEY;
    next();
}