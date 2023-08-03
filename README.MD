# Wordpress to Portable Text

Can take Wordpress content using the Wordpress API and convert it over into Portable Text used to import into Sanity.

## Installation

In the root directly, install the package

`npm install -g`

## Using

The `run` command accepts two arugments, the website domain `--domain` and the post `--post` type being retreived.

Ex.

`w2pt run -d https://yourwebsite.com -p post`

Make sure to pass the `http` or `https` on the URL.

## Notes

### Adding new Wordpress Data Types

To add a new data type, place them in the `sanity/objects` folder with the name `[data-type].mjs`. When you pass the argument to w2pt, it will look in that folder for the data type to use. A datatype takes in a `post` object (Wordpress API data response) and needs to export a `sanityObject` function.

### Adding new deserializers

To add new HTML deserializers to the HTML to Portable Text conversion, name a file with the tag you want, `[html-tag].mjs` in the `sanity/serializers` folder. As the script deserializers the content, it goes into this folder and grabs the deserializer for individual tags. A deserializer takes two arugments (`block` and `element`) and needs to export the `deserialize` function.

### Custom post types

Make sure when registering a custom post type that it is enabled for REST support.

`'show_in_rest' => true`

You will get the error `No route was found matching the URL and request method` if it is not.
