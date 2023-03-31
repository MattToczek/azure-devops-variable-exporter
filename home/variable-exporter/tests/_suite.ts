import * as path from 'path';
import * as assert from 'assert';
import * as ttm from 'azure-pipelines-task-lib/mock-test';

describe('Test JSON from file source to vars', function () {

    before( function() {

    });

    after(() => {

    });

    it('should output simple key pairs:', function(done: Mocha.Done) {
        this.timeout(3000);

        let tp = path.join(__dirname, 'simple.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
    
        tr.run();
        console.log(tr.succeeded);
        assert.strictEqual(tr.succeeded, true, 'should have succeeded');
        assert.strictEqual(tr.warningIssues.length, 0, "should have no warnings");
        assert.strictEqual(tr.errorIssues.length, 0, "should have no errors");
        console.log("done")
        assert.strictEqual(tr.stdOutContained("##vso[task.setvariable variable=simple-test;]passed"), true, "No variables exported")
        done();
    });

    it('should handle indexing of arrays:', function(done: Mocha.Done) {
        this.timeout(1000);

        let tp = path.join(__dirname, 'array.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
    
        tr.run();
        console.log(tr.succeeded);
        assert.strictEqual(tr.succeeded, true, 'should have succeeded');
        assert.strictEqual(tr.warningIssues.length, 0, "should have no warnings");
        assert.strictEqual(tr.errorIssues.length, 0, "should have no errors");
        console.log("done")
        assert.strictEqual(tr.stdOutContained("##vso[task.setvariable variable=0;]first"), true, "No variables exported")
        assert.strictEqual(tr.stdOutContained("##vso[task.setvariable variable=1;]second"), true, "No variables exported")
        assert.strictEqual(tr.stdOutContained("##vso[task.setvariable variable=2;]third"), true, "No variables exported")
        done();
    });

    it('should handle nested objects:', function(done: Mocha.Done) {
        this.timeout(1000);

        let tp = path.join(__dirname, 'nested_object.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
    
        tr.run();
        console.log(tr.succeeded);
        assert.strictEqual(tr.succeeded, true, 'should have succeeded');
        assert.strictEqual(tr.warningIssues.length, 0, "should have no warnings");
        assert.strictEqual(tr.errorIssues.length, 0, "should have no errors");
        console.log("done")
        assert.strictEqual(tr.stdOutContained("##vso[task.setvariable variable=this_0_is;]a nested object"), true, "No variables exported")
        done();
    });

    it('Should output sample vars from complex object:', function(done: Mocha.Done) {
        this.timeout(1000);

        let tp = path.join(__dirname, 'full.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
    
        tr.run();
        console.log(tr.succeeded);
        assert.strictEqual(tr.succeeded, true, 'should have succeeded');
        assert.strictEqual(tr.warningIssues.length, 0, "should have no warnings");
        assert.strictEqual(tr.errorIssues.length, 0, "should have no errors");
        console.log("done")
        assert.strictEqual(tr.stdOutContained("##vso[task.setvariable variable=glossary_GlossDiv_GlossList_GlossEntry_GlossDef_GlossSeeAlso_1;]XML"), true, "Missing variable export: glossary_GlossDiv_GlossList_GlossEntry_GlossDef_GlossSeeAlso_1")
        assert.strictEqual(tr.stdOutContained("##vso[task.setvariable variable=glossary_GlossDiv_GlossList_GlossEntry_SortAs;]SGML"), true, "Missing variable export: glossary_GlossDiv_GlossList_GlossEntry_SortAs")
        assert.strictEqual(tr.stdOutContained("##vso[task.setvariable variable=glossary_GlossDiv_GlossList_GlossEntry_GlossSee;]markup"), true, "Missing variable export: glossary_GlossDiv_GlossList_GlossEntry_GlossSee")
        done();
    });

    it('it should add "isOutput=true;" if output var is present', function(done: Mocha.Done) {
        this.timeout(1000);

        let tp = path.join(__dirname, 'output.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        
        tr.run();
        console.log(tr.succeeded);
        assert.strictEqual(tr.succeeded, true, 'should have succeeded');
        assert.strictEqual(tr.warningIssues.length, 0, "should have no warnings");
        assert.strictEqual(tr.errorIssues.length, 0, "should have no errors");
        console.log("done")
        assert.strictEqual(tr.stdOutContained("##vso[task.setvariable variable=simple-test;isOutput=true;]passed"), true, "No variables exported")
        done()
    });  
    
    it('it should add "issecret=true;" if secret var is present', function(done: Mocha.Done) {
        this.timeout(1000);

        let tp = path.join(__dirname, 'output.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        
        tr.run();
        console.log(tr.succeeded);
        assert.strictEqual(tr.succeeded, true, 'should have succeeded');
        assert.strictEqual(tr.warningIssues.length, 0, "should have no warnings");
        assert.strictEqual(tr.errorIssues.length, 0, "should have no errors");
        console.log("done")
        assert.strictEqual(tr.stdOutContained("##vso[task.setvariable variable=simple-test;issecret=true;]passed"), true, "No secret variables found")
        done()
    });

    it('it should add "isOutput=true;issecret=true;" if secret and output vars are present', function(done: Mocha.Done) {
        this.timeout(1000);

        let tp = path.join(__dirname, 'output.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        
        tr.run();
        console.log(tr.succeeded);
        assert.strictEqual(tr.succeeded, true, 'should have succeeded');
        assert.strictEqual(tr.warningIssues.length, 0, "should have no warnings");
        assert.strictEqual(tr.errorIssues.length, 0, "should have no errors");
        console.log("done")
        assert.strictEqual(tr.stdOutContained("##vso[task.setvariable variable=simple-test;isOutput=true;issecret=true;]passed"), true, "No secret variables found")
        done()
    });
});
