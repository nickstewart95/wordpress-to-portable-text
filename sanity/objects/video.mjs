import { convertBodyContent } from '../../lib/util.mjs';

import he from 'he';

export function sanityObject(post) {
	let id = 'imported_posts_' + post.id;
	let post_type = post.categories.includes(1465) ? 'news' : 'video';
	let title = he.decode(post.title.rendered);
	let date = new Date(post.date_gmt).toISOString();
	let youtube_id = post.acf.youtube_id;

	let content = post.acf.text;
	content = content ? content : '';
	let excerpt = content;

	content =
		'<p>' +
		content +
		'</p><iframe width="560" height="315" src="https://www.youtube.com/embed/' +
		youtube_id +
		'"></iframe>';

	let featured_image =
		'https://i3.ytimg.com/vi/' + youtube_id + '/maxresdefault.jpg';

	let topics = [];
	if (post.categories.length > 0) {
		post.categories.forEach((category) => {
			let mapping = topicMapping(category);

			if (mapping) {
				topics.push(mapping);
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
		mainImage: {
			_type: 'image',
			_sanityAsset: 'image@' + featured_image,
		},
		publishSettings: {
			publishedAt: date,
			_type: 'blogPublishSettings',
			publishTo: ['moonshineU'],
		},
		excerpt: excerpt,
		topics: topics,
		basicSeo: {
			_type: 'basicSeo',
			seoTitle: title,
		},
	};

	sanity_object.body = convertBodyContent(content);

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
