'use strict';

/**
 * audio-book service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::audio-book.audio-book');
