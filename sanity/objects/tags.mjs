export function sanityObject(tag) {
	let id = 'imported_moonshine_tags_' + tag.id;

	let sanity_object = {
		_id: id,
		_type: 'mediaTag',
		slug: {
			current: tag.slug,
			type: '_slug',
		},
		title: tag.name,
	};

	return sanity_object;
}
