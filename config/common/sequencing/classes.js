'use strict';

module.exports = {
    referencesResolver: require('../../../lib/common/sequencing/references-resolver'),
    sequence: require('../../../lib/common/sequencing/sequence'),
    sequencesContainer: require('../../../lib/common/sequencing/sequences-container'),
    collectionInterpreter: require('../../../lib/common/sequencing/collection-interpreter'),
    flowContext: require('../../../lib/common/sequencing/flow-context'),
    logger: require('../../../lib/common/sequencing/logger'),
    sequenceInterpreter: {
        abstract: require('../../../lib/common/sequencing/sequence-interpreter/abstract'),
        alias: require('../../../lib/common/sequencing/sequence-interpreter/alias'),
        children: require('../../../lib/common/sequencing/sequence-interpreter/children'),
        collections: require('../../../lib/common/sequencing/sequence-interpreter/collections'),
        embedded: require('../../../lib/common/sequencing/sequence-interpreter/embedded'),
        stream: require('../../../lib/common/sequencing/sequence-interpreter/stream'),
        operations: require('../../../lib/common/sequencing/sequence-interpreter/operations'),
        parents: require('../../../lib/common/sequencing/sequence-interpreter/parents')
    },
    configuration: {
        sectionProcessor: {
            sequences: require('../../../lib/common/sequencing/configuration/section-processor/sequences')
        }
    }
};