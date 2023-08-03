import { defineArrayMember, defineField } from 'sanity';
import { Schema } from '@sanity/schema';

export const schema = Schema.compile({
	name: 'myBlog',
	types: [
		{
			type: 'object',
			name: 'blockContent',
			fields: [
				{
					title: 'Title',
					type: 'string',
					name: 'title',
				},
				{
					title: 'Body',
					name: 'body',
					type: 'array',
					of: [
						defineArrayMember({
							type: 'block',
							styles: [
								{ title: 'Normal', value: 'normal' },
								{ title: 'H2', value: 'h2' },
								{ title: 'H3', value: 'h3' },
								{ title: 'H4', value: 'h4' },
								{ title: 'Quote', value: 'blockquote' },
							],
							lists: [
								{ title: 'Bullet', value: 'bullet' },
								{ title: 'Numbered', value: 'number' },
							],
							marks: {
								decorators: [
									{ title: 'Strong', value: 'strong' },
									{ title: 'Emphasis', value: 'em' },
								],

								annotations: [
									{
										title: 'Internal URL',
										name: 'internalUrl',
										type: 'object',
										fields: [
											defineField({
												title: 'URL',
												name: 'href',
												type: 'url',
												validation: (rule) =>
													rule.uri({
														allowRelative: true,
														relativeOnly: true,
													}),
											}),
										],
									},
									{
										title: 'External URL',
										name: 'externalUrl',
										type: 'object',
										fields: [
											defineField({
												title: 'URL',
												name: 'href',
												type: 'url',
												validation: (rule) =>
													rule.uri({
														scheme: ['https', 'mailto', 'tel'],
													}),
											}),
											defineField({
												title: 'Open in new window',
												name: 'isExternal',
												type: 'boolean',
												initialValue: false,
											}),
										],
									},
								],
							},
						}),
						defineArrayMember({
							type: 'image',
							options: { hotspot: true },
							fields: [
								defineField({
									name: 'alt',
									title: 'Alternative Text',
									type: 'string',
								}),
							],
						}),
						defineArrayMember({
							type: 'mediaEmbed',
							name: 'mediaEmbed',
							title: 'Media Embed',
							type: 'object',
							fields: [
								defineField({
									name: 'url',
									type: 'url',
									title: 'URL',
								}),
							],
						}),
					],
				},
			],
		},
	],
});
