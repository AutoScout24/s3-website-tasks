# S3 static website tasks

## Description

This module provides tasks for a multilingual static website hosted on S3.
It was developed with the AutoScout24/nginx setup in mind.
All tasks are implemented in Node.js.

## TODO

Make tasks independent of (AutoScout24) domain.

## Project requirements

### URL rewrites

The code assumes a proxy server in front of S3 which rewrites all URLs correctly.

The url rewrite pattern is:

https://www.autoscout24.TLD/SERVICE-PREFIX/PATH/
becomes
http://BUCKET_NAME.s3-website-eu-west-1.amazonaws.com/SERVICE-PREFIX/HOST/PATH/

Example:

https://www.autoscout24.it/moto/ktm/
becomes
http://as24-seo-pages-moto.s3-website-eu-west-1.amazonaws.com/moto/www.autoscout24.de/ktm/

### Detailed requirements

The tasks require the consuming website project to have the following setup:

* The website is multilingual
* The website/service is identified by one or more url path prefixes
* Content urls start with https://www.autoscout24.TLD/SERVICE-PREFIX/
* Assets urls start with https://www.autoscout24.TLD/assets/SERVICE-PREFIX/
* All languages are in the same S3 bucket separated by subfolders
* The S3 bucket uses static website hosting with `index.html` as Index Document
* All content pages have the name `index.html`
* The S3 Bucket has the following directory layout:
  * **assets/SERVICE-PREFIX/**: all assets
  * **SERVICE-PREFIX/**
    * **www.autoscout24.TLD/**: content for a specific tld
      * **some-path/index.html**: content for url https://www.as24.TLD/SERVICE-PREFIX/some-path/
  * **ANOTHER-SERVICE-PREFIX/**
    * **www.autoscout24.TLD/**: content for a tld which uses another service prefix

## Tasks

#### `checkForInternalDeadLinks({rootFolder, servicePrefixes})`

Scans all html files in the provided `rootFolder` directory for interal dead links.
A link is considered internal if its url starts with an item of the `servicePrefixes` array.

The function returns a list `DeadLinksByFile` objects which have the following structure: `{filename, deadLinks}`.

#### `createDeadLinksReport(deadLinksByFiles)`

Creates a csv string out of a list of `DeadLinksByFile` objects. The output from `checkForInternalDeadLinks()` can be piped into.

#### `createOrUpdateStack({stackName, cloudFormationTemplate})`

This is Node.js version of [Stacker.create_or_update_stack](https://github.com/Scout24/autostacker24#create-or-update) from [AutoStacker24](https://github.com/Scout24/autostacker24)

#### `minifyImages({srcFolder, destFolder, quality = 70})`

Creates a mozjpeg optimized version and a webp version in `destFolder` for every jpeg file found inside `srcFolder`.

#### `uploadCustomRedirectObjects({s3BucketName, redirectsFolder})`

Creates custom 301 redirects using 0 byte S3 objects and the `x-amz-website-redirect-location` metadata property.
The `redirectsFolder` is scanned for csv files which must have the host as filename (example: `www.autoscout24.de.csv`).
The first column is the url FROM which will be redirected and the second column is the url TO which will be redirected.

Example:

`"moto/speling-error","moto/spelling-error"`

#### `uploadTrailingSlashRedirectObjects({s3BucketName, rootFolder})`

Creates zero byte S3 objects for every folder inside `rootFolder` without trailing slashes for 301 redirects to the correct url in case of missing trailing slashes.
