export default function (block, el, next) {
	if (
		el.childNodes.length === 1 &&
		el.childNodes.tagName &&
		el.childNodes[0].tagName.toLowerCase() === 'img'
	) {
		let alt_text =
			el.childNodes[0].getAttribute('alt') !== null
				? el.childNodes[0].getAttribute('alt')
				: '';

		return block({
			_type: 'image',
			_sanityAsset: `image@${el.childNodes[0]
				.getAttribute('src')
				.replace(/^\/\//, 'https://')}`,
			alt: alt_text,
		});
	} else {
		return undefined;
	}
}
