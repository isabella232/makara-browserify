"use strict";

var bcp47 = require('bcp47');

module.exports = {
    build: function (root, cb) {
        require('./build')(root, cb);
    },
    languagePackPath: languagePackPath,
    middleware: function() {
        return function (req, res, next) {
            if (!res.locals.makara) res.locals.makara = {};
            res.locals.makara.languagePackPath = languagePackPath(res.locals.locale);
            next();
        };
    }

};

function languagePackPath(locale) {
    if (!locale) throw new Error("Must specify a locale");
    // Handle PayPal-style input
    if (locale.language && locale.country) locale = locale.language + '-' + locale.country;

    // Handle strings
    if (typeof locale == 'string') locale = bcp47.parse(locale);

    if (!locale || !locale.langtag || !locale.langtag.language || !locale.langtag.language.language || !locale.langtag.region) throw new Error('Invalid locale');

    return locale.langtag.language.language + '-' + locale.langtag.region + '/_languagepack.js';
}
