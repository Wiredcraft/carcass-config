// var debug = require('debug')('carcass:test');

// var should = require('should');
var parsers = require('../').parsers;

var Config = require('../classes/Config');
var config = null;

var path = require('path');
var root = path.resolve(__dirname, 'fixture');
var lorem = path.resolve(root, 'configs', 'lorem.json');
var ipsum = path.resolve(root, 'configs', 'ipsum.json');
var dolor = path.resolve(root, 'configs', 'dolor.json');

describe('Parsers:', function() {

    it('should have some parsers', function() {
        parsers.should.be.type('object');
        parsers.should.have.property('cjson').with.type('function');
        parsers.should.have.property('eson').with.type('function');
        parsers.should.have.property('file').with.type('function');
    });

    describe('File reader:', function() {

        before(function() {
            config = new Config(lorem, ipsum);
            config.parser([parsers.file, function(item) {
                return JSON.parse(item);
            }]);
        });

        it('can reload', function(done) {
            config.reload(function(err, res) {
                res.should.be.type('object');
                res.should.have.property('lorem', 'ipsum');
                res.should.have.property('dolor', false);
                res.should.have.property('root', '{root}');
                done(err);
            });
        });
    });

    describe('File reader and a json with comments:', function() {

        before(function() {
            config = new Config(lorem, ipsum, dolor);
            config.parser([parsers.file, function(item) {
                return JSON.parse(item);
            }]);
        });

        it('should throw', function() {
            config.reload.should.throwError();
        });
    });

    describe('File reader and a bad source:', function() {

        before(function() {
            config = new Config(lorem, 'whatever', ipsum);
            config.parser([parsers.file, function(item) {
                return JSON.parse(item);
            }]);
        });

        it('can reload', function(done) {
            config.reload(function(err, res) {
                res.should.be.type('object');
                res.should.have.property('lorem', 'ipsum');
                res.should.have.property('dolor', false);
                res.should.have.property('root', '{root}');
                done(err);
            });
        });
    });

    describe('File reader + cjson:', function() {

        before(function() {
            config = new Config(lorem, ipsum, dolor);
            config.parser([parsers.file, parsers.cjson, function(item) {
                return JSON.parse(item);
            }]);
        });

        it('can reload', function(done) {
            config.reload(function(err, res) {
                res.should.be.type('object');
                res.should.have.property('lorem', 'ipsum');
                res.should.have.property('dolor', 'something');
                res.should.have.property('root', '{root}');
                done(err);
            });
        });
    });

    describe('File reader + eson:', function() {

        before(function() {
            config = new Config(lorem, ipsum);
            config.parser([parsers.file, parsers.eson()]);
        });

        it('can reload', function(done) {
            config.reload(function(err, res) {
                res.should.be.type('object');
                res.should.have.property('lorem', 'ipsum');
                res.should.have.property('dolor', false);
                res.should.have.property('root', '{root}');
                done(err);
            });
        });
    });

    describe('File reader + eson:', function() {

        before(function() {
            config = new Config(lorem, ipsum);
            var eson = parsers.eson().use(parsers.eson.replace('{root}', root));
            config.parser([parsers.file, eson]);
        });

        it('can reload', function(done) {
            config.reload(function(err, res) {
                res.should.be.type('object');
                res.should.have.property('lorem', 'ipsum');
                res.should.have.property('dolor', false);
                res.should.have.property('root', root);
                res.should.have.property('two_seconds', '2 seconds');
                res.should.have.property('two_minutes', '2 minutes');
                res.should.have.property('two_hours', '2 hours');
                res.should.have.property('two_days', '2 days');
                done(err);
            });
        });
    });

    describe('File reader + eson + eson.seconds:', function() {

        before(function() {
            config = new Config(lorem, ipsum);
            var eson = parsers.eson().use(parsers.eson.seconds);
            config.parser([parsers.file, eson]);
        });

        it('can reload', function(done) {
            config.reload(function(err, res) {
                res.should.be.type('object');
                res.should.have.property('lorem', 'ipsum');
                res.should.have.property('dolor', false);
                res.should.have.property('root', '{root}');
                res.should.have.property('two_seconds', 2);
                res.should.have.property('two_minutes', 120);
                res.should.have.property('two_hours', 7200);
                res.should.have.property('two_days', 172800);
                done(err);
            });
        });
    });

    describe('File reader + cjson + eson:', function() {

        before(function() {
            config = new Config(lorem, ipsum, dolor);
            var eson = parsers.eson().use(parsers.eson.replace('{root}', root));
            config.parser([parsers.file, parsers.cjson, eson]);
        });

        it('can reload', function(done) {
            config.reload(function(err, res) {
                res.should.be.type('object');
                res.should.have.property('lorem', 'ipsum');
                res.should.have.property('dolor', 'something');
                res.should.have.property('root', root);
                done(err);
            });
        });
    });

});
