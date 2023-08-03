export default function (block, el, next) {
	let source = el.getAttribute('src');
	let alt_text = el.getAttribute('alt') !== null ? el.getAttribute('alt') : '';

	// Images need to be absolute
	if (!(source.indexOf('://') > 0 || source.indexOf('//') === 0)) {
		source = 'https://flavorman.com' + source;
	}

	return block({
		_type: 'image',
		_sanityAsset: 'image@' + source,
		alt: alt_text,
	});
}
