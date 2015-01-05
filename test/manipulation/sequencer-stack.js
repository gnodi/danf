'use strict';

require('../../lib/init');

var assert = require('assert'),
    Sequencer = require('../../lib/manipulation/sequencer'),
    SequencerStack = require('../../lib/manipulation/sequencer-stack')
;

var sequencerStack = new SequencerStack();

describe('SequencerStack', function() {
    var sequencer1 = new Sequencer(),
        sequencer2 = new Sequencer(),
        sequencer3 = new Sequencer()
    ;

    it('method "push" should add a sequencer on the stack', function() {
        sequencer1._streamContext = 1;
        sequencer2._streamContext = 2;
        sequencer3._streamContext = 3;
        sequencer1._globalContext = 1;
        sequencer2._globalContext = 2;
        sequencer3._globalContext = 3;

        sequencerStack.push(sequencer1);
        sequencerStack.push(sequencer2);
        sequencerStack.push(sequencer3);

        assert.equal(sequencerStack._stack.length, 3);
    })

    it('method "retrieveStreamContexts" should retrieve an array of the stream contexts of the sequencers in the stack', function() {
        assert.deepEqual(
            sequencerStack.retrieveStreamContexts(),
            [1, 2, 3]
        );
    })

    it('method "free" should free a sequencer in the stack', function() {
        sequencerStack.free(sequencer2);

        assert.deepEqual(
            sequencerStack.retrieveStreamContexts(),
            [1, 2, 3]
        );

        sequencerStack.free(sequencer3);

        assert.deepEqual(
            sequencerStack.retrieveStreamContexts(),
            [1]
        );
    })

    it('method "retrieveGlobalContexts" should retrieve an array of the global contexts of the sequencers in the stack', function() {
        assert.deepEqual(
            sequencerStack.retrieveGlobalContexts(),
            [1]
        );
    })
})