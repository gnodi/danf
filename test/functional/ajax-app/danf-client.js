'use strict';

function NameSetter() {}
NameSetter.prototype.set = function(data) {
    var $ = this.jquery,
        element = $(data)
    ;

    $('#hello').text(element.find('#hello').text());
};

module.exports = {
    config: {
        events: {
            event: {
                'danf:form.name': {
                    sequences: ['setName']
                }
            }
        },
        sequences: {
            setName: [
                {
                    service: 'nameSetter',
                    method: 'set',
                    arguments: ['@data.data@']
                }
            ]
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
};