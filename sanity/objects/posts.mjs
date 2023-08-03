import { convertBodyContent } from '../../lib/util.mjs';

import he from 'he';

export function sanityObject(post) {
	let id = 'imported_posts_' + post.id;
	let post_type = post.categories.includes(1465) ? 'news' : 'blog';
	let title = he.decode(post.title.rendered);
	let date = new Date(post.date_gmt).toISOString();

	let excerpt = post.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, '');
	if (excerpt != null) {
		excerpt = he.decode(excerpt);
		excerpt = excerpt.replace(' …read more', '');
	}

	let featured_image = post._embedded['wp:featuredmedia']['0'].source_url;

	let seo_title = post.yoast_head_json.title
		? he.decode(post.yoast_head_json.title)
		: null;

	let seo_description = post.yoast_head_json.description
		? he.decode(post.yoast_head_json.description)
		: null;

	let open_graph_image =
		post.yoast_head_json.og_image[0] === undefined
			? featured_image
			: post.yoast_head_json.og_image[0].url;

	let topics = [];
	if (post.categories.length > 0) {
		post.categories.forEach((category) => {
			let mapping = topicMapping(category);

			if (mapping) {
				topics.push(mapping);
			}
		});
	}

	let tags = [];
	if (post.tags.length > 0) {
		post.tags.forEach((tag) => {
			let mapping = tagMapping(tag);

			if (mapping) {
				tags.push(mapping);
			}
		});
	}

	let sanity_object = {
		_id: id,
		_type: 'mediaPost',
		_createdAt: date,
		_updatedAt: date,
		mediaType: post_type,
		slug: {
			current: post.slug,
			type: '_slug',
		},
		title: title,
		excerpt: excerpt,
		mainImage: {
			_type: 'image',
			_sanityAsset: 'image@' + featured_image,
		},
		publishSettings: {
			publishedAt: date,
			_type: 'blogPublishSettings',
			publishTo: ['moonshineU'],
		},
		topics: topics,
		tags: tags,
		basicSeo: {
			_type: 'basicSeo',
			seoTitle: seo_title,
			seoDescription: seo_description,
			openGraphImage: {
				_type: 'image',
				_sanityAsset: 'image@' + open_graph_image,
			},
		},
	};

	let post_content = post.content.rendered;

	if (post_content != null) {
		// Remove featured image in post content
		let regex = /<img[^>]+src="?([^"\s]+)"?[^>]*\/>/g;
		let images = post_content.match(regex);

		if (images != null && images.length > 0) {
			let image = images[0];
			let source = image.slice(image.indexOf('src')).split('"')[1];

			if (source == featured_image) {
				post_content = post_content.replace(image, '');
				post_content = post_content.replace(/^\s*\n/m, '');
			}
		}

		sanity_object.body = convertBodyContent(post_content);
	}

	return sanity_object;
}

function topicMapping(wordpress_category) {
	let topics = {
		alumni: '9ee311a6-e1fd-43ca-94f0-3decadc7c2f4',
		blog: '8ab6fd2c-00b6-473f-be6e-75919862cc75',
		courses: '758ded56-a1bd-47b5-9706-254039a67680',
		spirits: '9dd53835-39f2-4af4-b9ad-7af888f0e242',
	};

	let topic_id = false;
	switch (wordpress_category) {
		case 5:
			topic_id = topics.alumni;
			break;
		case 3:
			topic_id = topics.blog;
			break;
		case 1030:
			topic_id = topics.courses;
			break;
		case 133:
			topic_id = topics.spirits;
			break;
		case 1:
			topic_id = topics.blog;
			break;
	}

	if (topic_id) {
		return {
			_type: 'reference',
			_ref: topic_id,
		};
	} else {
		return false;
	}
}

function tagMapping(wordress_tag) {
	let tag_id = 'imported_moonshine_tags_' + wordress_tag;

	return {
		_type: 'reference',
		_ref: tag_id,
	};
}
