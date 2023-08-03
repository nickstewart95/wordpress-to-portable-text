#! /usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { Command } from 'commander';
import chalk from 'chalk';

import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Grab post count
async function grabPostCount(domain, post_type) {
	console.log('Grabbing ' + post_type + ' count.');

	try {
		let response = await fetch(
			domain + '/wp-json/wp/v2/' + post_type + '?_embed&per_page=1&page=1'
		);

		if (response.headers.get('X-Wp-Total') != null) {
			return response.headers.get('X-Wp-Total');
		} else {
			console.log(
				chalk.red(
					'Could not fetch total count of ' +
						post_type +
						'... make sure ' +
						post_type +
						' has REST support'
				)
			);
			return false;
		}
	} catch (error) {
		console.log(chalk.red(error));
	}
}

// Grab posts from the WordPress API
async function grabPosts(domain, post_type, page) {
	console.log('Grabbing ' + post_type + ' for page ' + page + '.');

	let url = domain + '/wp-json/wp/v2/' + post_type;
	let params = '?page=' + page + '&_embed&per_page=50';

	if (post_type == 'tags') {
		params = params + '&hide_empty=true&taxonomy=post_tag';
	}

	let response = await fetch(url + params);

	let json = await response.json();

	return json;
}

async function processPost(domain, post_type) {
	let location = path.join(
		__dirname,
		'..',
		'sanity',
		'objects',
		post_type + '.mjs'
	);

	try {
		await import(location).then((module) => {
			// Find out how many posts there are and then loop
			grabPostCount(domain, post_type).then((postCount) => {
				var pages = Math.round(postCount / 50);

				for (let i = 1; i < pages + 1; i++) {
					grabPosts(domain, post_type, i)
						.then((posts) => {
							var holder = [];
							console.log('Setting up post object for page ' + i + '.');

							posts.forEach((data) => {
								var sanity_object = module.sanityObject(data);
								holder.push(sanity_object);
							});

							return holder;
						})
						.then((holder) => {
							console.log('Appending to NDJSON file.');

							// ndJSON new line per item
							holder = holder.map(JSON.stringify).join('\n');
							holder = '\n' + holder;

							let export_location = path.join(
								__dirname,
								'..',
								'exports',
								post_type + '.ndjson'
							);

							fs.appendFile(export_location, holder, (error) => {
								if (error) {
									console.log(chalk.red(error));
								} else {
									console.log('Append complete.');
								}
							});
						});
				}
			});
		});
	} catch (error) {
		console.log(chalk.red(error));
	}
}

var program = new Command();
program
	.name('w2pt')
	.description('Convert Wordpress data to portable text for Sanity')
	.version('1.0.0');
program
	.command('run')
	.description('Fetch data and convert to portable text')
	.requiredOption(
		'-d, --domain <string>',
		'must declare the domain of the Wordpress install'
	)
	.requiredOption('-p, --post <string>', 'must declare the post type')
	.action((arg, options) => {
		fs.stat('./exports/' + arg.post + '.ndjson', function (err, stats) {
			if (!err) {
				fs.unlink('./exports/' + arg.post + '.ndjson', function (err) {
					console.log(chalk.green('Old data deleted.'));
				});
			} else {
				console.log(chalk.red('Issue deleting old data.'));
			}
		});

		processPost(arg.domain, arg.post);
	});

program.parse();
