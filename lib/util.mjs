import { htmlToBlocks, getBlockContentFeatures } from '@sanity/block-tools';
import { randomKey } from '@sanity/util/content';

import jsdom from 'jsdom';
const { JSDOM } = jsdom;

// TODO: Allow for custom schema
import { schema } from '../sanity/schema/default.mjs';

// Load deserializers
import p from '../sanity/deserializers/p.mjs';
import img from '../sanity/deserializers/img.mjs';
import iframe from '../sanity/deserializers/iframe.mjs';
import a from '../sanity/deserializers/a.mjs';

// Throw them in a object that we can reference later
const deserializers = { p: p, img: img, a: a, iframe: iframe };

export function convertBodyContent(content) {
	const blockContentType = schema
		.get('blockContent')
		.fields.find((field) => field.name === 'body').type;

	return htmlToBlocks(content, blockContentType, {
		parseHtml: (html) => new JSDOM(html).window.document,
		rules: [
			{
				deserialize(el, next, block) {
					if (el.tagName === undefined) {
						return undefined;
					}

					let tag = el.tagName.toLowerCase();

					if (deserializers.hasOwnProperty(tag)) {
						return deserializers[tag](block, el, next);
					}

					return undefined;
				},
			},
		],
	});
}
