'use strict';

module.exports = {
    linkFollower: {
        methods: {
            /**
             * Follow a link.
             *
             * @param {object} link The link DOM node.
             */
            follow: {
                arguments: ['object/link']
            },
            /**
             * Write a link content into the page.
             *
             * @param {string} content The content.
             * @param {object} link The link DOM node.
             * @param {object} event The event object.
             */
            write: {
                arguments: ['string/content', 'object/link', 'object/event']
            }
        }
    },
    formSubmitter: {
        methods: {
            /**
             * Submit a form.
             *
             * @param {object} submitter The submitter DOM node.
             */
            submit: {
                arguments: ['object/submitter']
            },
            /**
             * Write a form return content into the page.
             *
             * @param {string} content The content.
             * @param {object} submitter The submitter DOM node.
             */
            write: {
                arguments: ['string/content', 'object/submitter']
            }
        }
    }
};