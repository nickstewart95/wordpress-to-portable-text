import { randomKey } from '@sanity/util/content';

export default function (block, el, next) {
	let href = el.getAttribute('href');
	let url_type = 'internal';

	// Determine if its internal or external
	if (href.includes('flavorman.com')) {
		href = href.replace(/^.*\/\/[^\/]+/, '');
		url_type = 'internal';
	}
	if (href.indexOf('://') > 0 || href.indexOf('//') === 0) {
		url_type = 'external';
	}

	let markDef;
	if (url_type == 'internal') {
		markDef = {
			_key: randomKey(12),
			_type: 'internalUrl',
			href: href,
		};
	} else {
		markDef = {
			_key: randomKey(12),
			_type: 'externalUrl',
			href: href,
			isExternal: true,
		};
	}

	return {
		_type: '__annotation',
		markDef: markDef,
		children: next(el.childNodes),
	};
}
