export default function (block, el, next) {
	var iframeSrc = el.contentDocument.location.href;

	return block({
		_type: 'mediaEmbed',
		url: iframeSrc,
	});
}
