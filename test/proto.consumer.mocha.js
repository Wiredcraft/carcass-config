// var debug = require('debug')('carcass:test');

var should = require('should');
var carcass = require('carcass');
var lib = require('../');

var path = require('path');
var root = path.resolve(__dirname, 'fixture', 'configs');

describe('Proto / consumer:', function() {

    it('should be a proto', function() {
        lib.should.have.property('proto').with.type('object');
        lib.proto.should.have.property('consumer').with.type('object');
    });

    describe('Use:', function() {

        var manager = carcass.mixable();
        var obj = carcass.mixable();

        before(function() {
            obj.mixin(lib.proto.consumer);
            manager.mixin(lib.proto.manager);
            manager.configDir(root).initConfig();
        });

        it('should have some methods', function() {
            obj.should.have.property('configManager').with.type('function');
            obj.should.have.property('configName').with.type('function');
            obj.should.have.property('config').with.type('function');
        });

        it('can have constructor as the default name', function() {
            obj.configName().should.equal('Object');
        });

        it('can have id as the default name', function() {
            obj._id = 'lorem';
            obj.configName(null).should.equal(obj);
            obj.configName().should.equal('lorem');
        });

        it('can have a different name', function() {
            obj.configName('configDefault').should.equal(obj);
            obj.configName().should.equal('configDefault');
        });

        it('should not have a default manager', function() {
            should.not.exist(obj.configManager());
        });

        it('cannot get config without a manager', function() {
            should.not.exist(obj.config());
        });

        it('can have a manager', function() {
            obj.configManager(manager).should.equal(obj);
            obj.configManager().should.equal(manager);
        });

        it('cannot get config before reload', function() {
            should.not.exist(obj.config());
        });

        it('reload', function(done) {
            manager.reload(done);
        });

        it('can get config with a good name', function() {
            obj.configName('configDefault').should.equal(obj);
            obj.config().should.equal(true);
        });

        it('can get config with a good name', function() {
            obj.configName('configTest').should.equal(obj);
            obj.config().should.equal(true);
        });

        it('cannot get config with a bad name', function() {
            obj.configName('xxx').should.equal(obj);
            should.not.exist(obj.config());
        });
    });
});
