// var debug = require('debug')('carcass:test');

// var should = require('should');
var fs = require('fs');
var eson = require('eson');

var Config = require('../classes/Config');
var config = null;

var path = require('path');
var root = path.resolve(__dirname, 'fixture');
var lorem = path.resolve(root, 'configs', 'lorem.json');
var ipsum = path.resolve(root, 'configs', 'ipsum.json');

describe('Classes / Config:', function() {

    it('should be a class', function() {
        Config.should.be.type('function');
        (new Config()).should.be.type('object');
    });

    describe('An instance:', function() {

        before(function() {
            config = new Config();
        });

        it('should be an object', function() {
            config.should.be.type('object');
        });

        it('should be mixable', function() {
            config.should.have.property('mixin').with.type('function');
        });

        it('should have some methods', function() {
            config.should.have.property('source').with.type('function');
            config.should.have.property('parser').with.type('function');
            config.should.have.property('reload').with.type('function');
        });

        it('can stack a source', function() {
            config.source(lorem).should.equal(config);
            config.source().should.eql([lorem]);
        });

        it('can reload', function(done) {
            var stream = config.reload();
            stream.should.be.type('object');
            stream.should.have.property('pull').with.type('function');
            stream.pull(function(err, res) {
                res.should.be.type('object');
                res.should.have.property('lorem', 'ipsum');
                res.should.have.property('dolor', true);
                res.should.not.have.property('root');
                done(err);
            });
        });

        it('can reload', function(done) {
            config.reload(function(err, res) {
                res.should.be.type('object');
                res.should.have.property('lorem', 'ipsum');
                res.should.have.property('dolor', true);
                res.should.not.have.property('root');
                done(err);
            });
        });

        it('can stack one more source', function() {
            config.source(ipsum).should.equal(config);
            config.source().should.eql([lorem, ipsum]);
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

    describe('An instance with an initial source:', function() {

        before(function() {
            config = new Config(lorem);
        });

        it('can reload', function(done) {
            config.source().should.eql([lorem]);
            config.reload(function(err, res) {
                res.should.be.type('object');
                res.should.have.property('lorem', 'ipsum');
                res.should.have.property('dolor', true);
                res.should.not.have.property('root');
                done(err);
            });
        });
    });

    describe('An instance with two initial sources:', function() {

        before(function() {
            config = new Config(lorem, ipsum);
        });

        it('can reload', function(done) {
            config.source().should.eql([lorem, ipsum]);
            config.reload(function(err, res) {
                res.should.be.type('object');
                res.should.have.property('lorem', 'ipsum');
                res.should.have.property('dolor', false);
                res.should.have.property('root', '{root}');
                done(err);
            });
        });
    });

    describe('An instance with eson as the parser:', function() {

        before(function() {
            config = new Config(lorem, ipsum);
            var conf = eson().use(eson.replace('{root}', root));
            var parser = conf.read.bind(conf);
            config.parser(parser);
        });

        it('can reload', function(done) {
            config.source().should.eql([lorem, ipsum]);
            config.reload(function(err, res) {
                res.should.be.type('object');
                res.should.have.property('lorem', 'ipsum');
                res.should.have.property('dolor', false);
                res.should.have.property('root', root);
                done(err);
            });
        });
    });

    describe('An instance with eson as the parser:', function() {

        before(function() {
            config = new Config(lorem, ipsum);
            var parser = {
                eson: eson().use(eson.replace('{root}', root)),
                parse: function(item) {
                    return this.eson.read(item);
                }
            };
            config.parser(parser);
        });

        it('can reload', function(done) {
            config.source().should.eql([lorem, ipsum]);
            config.reload(function(err, res) {
                res.should.be.type('object');
                res.should.have.property('lorem', 'ipsum');
                res.should.have.property('dolor', false);
                res.should.have.property('root', root);
                done(err);
            });
        });
    });

    describe('An instance with two parsers:', function() {

        before(function() {
            config = new Config(lorem, ipsum);
            var conf = eson().use(eson.replace('{root}', root));
            config.parser([function(item) {
                return fs.readFileSync(item, 'utf8');
            }, conf]);
        });

        it('can reload', function(done) {
            config.source().should.eql([lorem, ipsum]);
            config.reload(function(err, res) {
                res.should.be.type('object');
                res.should.have.property('lorem', 'ipsum');
                res.should.have.property('dolor', false);
                res.should.have.property('root', root);
                done(err);
            });
        });
    });
});
