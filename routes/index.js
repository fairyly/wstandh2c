var express = require('express');
var router = express.Router();
var webshot = require('webshot');
var layoutPath = '../layouts/layout';
var cheerio = require('cheerio')
var options = {
    screenSize: {
        width: 322,
        height: 642
    },
    shotSize: {
        width: 322,
        height: '642'
    },
    siteType: 'html',
    userAgent: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_2 like Mac OS X; en-us)' + ' AppleWebKit/531.21.20 (KHTML, like Gecko) Mobile/7B298g'
}
router.get('/', function(req, res, next) {
    res.render('index', {
        layout: layoutPath,
        title: 'helloyoho',
        webshotimg: '/images/yoho.png'
    }, function(err, html) {
        var $ = cheerio.load(html);
        var jielun_wrapper = $.html('.jielun_wrapper').replace(/\/local\//g,'');
        webshot(jielun_wrapper, 'public/images/yoho.png', options, function(err) {
            res.send(html);
        });

    });
});

module.exports = router;