'use strict';

var utils = require('../../../../lib/common/utils');

function NameSetter() {}
NameSetter.prototype.set = function(data) {
    var $ = this.jquery,
        element = $(data)
    ;

    $('#hello').text(element.find('#hello').text());
};

module.exports = utils.merge(
    require('./danf-common'),
    {
        config: {
            events: {
                event: {
                    'danf:form.name': {
                        sequences: [
                            {
                                name: 'setName'
                            }
                        ]
                    }
                }
            },
            sequences: {
                setName: {
                    operations: [
                        {
                            service: 'nameSetter',
                            method: 'set',
                            arguments: ['@data.data@']
                        }
                    ]
                }
            },
            services: {
                nameSetter: {
                    class: NameSetter,
                    properties: {
                        jquery: '#danf:vendor.jquery#'
                    }
                }
            }
        }
    },
    true
);