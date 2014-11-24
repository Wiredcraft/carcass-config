// var debug = require('debug')('carcass:test');

// var should = require('should');
var parsers = require('../').parsers;

var Config = require('../classes/Config');
var config = null;

var path = require('path');
var root = path.resolve(__dirname, 'fixture');
var lorem = path.resolve(root, 'configs', 'lorem.yml');
var ipsum = path.resolve(root, 'configs', 'ipsum.yml');
var dolor = path.resolve(root, 'configs', 'dolor.yml');

describe('Parsers with YAML sources:', function() {

    it('should have some parsers', function() {
        parsers.should.be.type('object');
        parsers.should.have.property('yaml').with.type('function');
        parsers.should.have.property('eson').with.type('function');
        parsers.should.have.property('file').with.type('function');
    });

    describe('File reader + yaml:', function() {

        before(function() {
            config = new Config(lorem, ipsum, dolor);
            config.parser([parsers.file, parsers.yaml]);
        });

        it('can reload', function(done) {
            config.reload(function(err, res) {
                res.should.be.type('object');
                res.should.have.property('lorem', 'ipsum');
                res.should.have.property('dolor', 'something');
                res.should.have.property('root', '{root}');
                res.should.have.property('ipsum').with.type('object');
                res.ipsum.should.have.property('lorem', true);
                res.ipsum.should.have.property('ipsum', true);
                done(err);
            });
        });
    });

    describe('File reader + yaml + eson:', function() {

        before(function() {
            config = new Config(lorem, ipsum, dolor);
            var eson = parsers.eson().use(parsers.eson.replace('{root}', root));
            config.parser([parsers.file, parsers.yaml, eson]);
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
