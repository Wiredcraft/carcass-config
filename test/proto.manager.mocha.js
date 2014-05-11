// var debug = require('debug')('carcass:test');

var should = require('should');
var carcass = require('carcass');
var lib = require('../');

var path = require('path');
var root = path.resolve(__dirname, 'fixture', 'configs');

// Test consumer.
function Consumer(a, b) {
    this.a = a;
    this.b = b;
}
Consumer.prototype.configManager = carcass.helpers.accessor('_configManager');

describe('Proto / manager:', function() {

    it('should be a proto', function() {
        lib.should.have.property('proto').with.type('object');
        lib.proto.should.have.property('manager').with.type('object');
    });

    describe('Use:', function() {
        var obj = carcass.mixable();

        before(function() {
            obj.mixin(lib.proto.manager);
        });

        it('should have some methods', function() {
            obj.should.have.property('env').with.type('function');
            obj.should.have.property('configDir').with.type('function');
            obj.should.have.property('source').with.type('function');
            obj.should.have.property('parser').with.type('function');
            obj.should.have.property('initConfig').with.type('function');
            obj.should.have.property('reload').with.type('function');
            obj.should.have.property('getConsumer').with.type('function');
        });

        it('should have a default env', function() {
            obj.env().should.be.type('string');
        });

        it('should not have a default dir', function() {
            should.not.exist(obj.configDir());
        });

        it('should not have default settings', function() {
            should.not.exist(obj.settings);
        });

        it('should not have default parsers', function() {
            should.not.exist(obj.parser());
        });

        it('can init', function() {
            obj.initConfig().should.equal(obj);
        });

        it('should have an empty settings now', function() {
            obj.settings.should.be.type('object');
            obj.settings.should.eql({});
        });

        it('should have some default parsers now', function() {
            obj.parser().should.be.type('object').with.lengthOf(3);
        });

        it('should not have sources without a dir', function() {
            obj.source().should.eql([]);
        });

        it('can have a dir', function() {
            obj.configDir(root).should.equal(obj);
            obj.configDir().should.equal(root);
        });

        it('can init again', function() {
            obj.initConfig().should.equal(obj);
        });

        it('should have some sources now', function() {
            obj.source().should.be.type('object').with.lengthOf(3);
        });

        it('can reload', function(done) {
            obj.reload(done);
        });

        it('should have settings now', function() {
            obj.get('configDefault').should.equal(true);
            obj.get('configTest').should.equal(true);
            obj.get('config').should.equal(true);
            obj.get('root').should.equal('{root}');
        });

        it('can have different eson plugins', function() {
            var eson = lib.parsers.eson;
            obj.parser([lib.parsers.file, eson().use(eson.replace('{root}', root))]);
        });

        it('can reload', function(done) {
            obj.reload(done);
        });

        it('should have settings now', function() {
            obj.get('root').should.equal(root);
        });

        it('can get a consumer', function() {
            var consumer = obj.getConsumer(Consumer, 1, 2);
            consumer.should.be.type('object');
            consumer.should.have.property('a', 1);
            consumer.should.have.property('b', 2);
            consumer.should.have.property('configManager').with.type('function');
            consumer.configManager().should.equal(obj);
        });

        it('can get a consumer', function() {
            obj.classes = {
                Consumer: Consumer
            };
            var consumer = obj.getConsumer('Consumer', 1, 2);
            consumer.should.be.type('object');
            consumer.should.have.property('a', 1);
            consumer.should.have.property('b', 2);
            consumer.should.have.property('configManager').with.type('function');
            consumer.configManager().should.equal(obj);
        });

    });
});
