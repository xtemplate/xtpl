var xtpl = require('../../');
xtpl.config({
    XTemplate: require('xtemplate')
});
var path = require('path');
var expect = require('chai').expect;
describe('xtpl', function () {
    it('works on node', function (done) {
        xtpl.renderFile(path.resolve(__dirname,'../fixture/main.xtpl'), {
            y: '<',
            x: '>'
        }, function (err, data) {
            expect(err).to.equal(null);
            expect(data).to.equal('<&gt;');
            done();
        });
    });
});