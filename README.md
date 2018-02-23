# S3 static website tasks

[![Build Status](https://travis-ci.org/Scout24/s3-static-website-tasks.svg?branch=master)](https://travis-ci.org/Scout24/s3-static-website-tasks)

## Description

This module provides tasks for a multi domain static website hosted on S3. It was developed with the AutoScout24/nginx setup in mind.

All tasks are implemented in Node.js.

## TODOs

- add support for belgium language urls (only in dead link check?)

## Project requirements

### URL rewrites

The code assumes a proxy server in front of S3 which rewrites all URLs correctly.

The url rewrite pattern is:

| Original url | Rewritten url |
| --- | --- |
| https://FQDN/SERVICE-PREFIX/PATH/ | http://BUCKET_NAME.s3-website-REGION.amazonaws.com/SERVICE-PREFIX/FQDN/PATH/ |
| https://www.autoscout24.it/moto/ktm/ | http://as24-seo-pages-moto.s3-website-eu-west-1.amazonaws.com/moto/www.autoscout24.it/ktm/ |


### Detailed requirements

The tasks require the consuming website project to have the following setup:

* The website provides different versions per domain
* The website is identified by one or more url path prefixes
* Content urls start with https://FQDN/SERVICE-PREFIX/
* Assets urls start with https://FQDN/assets/SERVICE-PREFIX/
* All versions are in the same S3 bucket separated by subfolders with FQDN as name
* The S3 bucket uses static website hosting with `index.html` as Index Document
* All content pages have the name `index.html`
* The S3 Bucket has the following directory layout:
  * **assets/SERVICE-PREFIX/**: all assets
  * **SERVICE-PREFIX/**
    * **FQDN/**: content for a specific domain
  * **ANOTHER-SERVICE-PREFIX/**
    * **FQDN/**: content for a domain which uses another service prefix

## Tasks

All tasks return a `Promise` object.

#### `checkForInternalDeadLinks({rootFolder, secondLevelDomain, pathPrefixes})`

* **rootFolder** - Folder which will be scanned for html files
* **secondLevelDomain** - Second level domain of the FQDN (e.g. autoscout24)
* **pathPrefixes** - Array of url path prefixes used for the service/website

Scans all html files found in `rootFolder` for interal dead links.
A link is considered internal if its url contains the `secondLevelDomain` (e.g. autoscout24) and an item of the `servicePrefixes` array.

The function yields a list `DeadLinksByFile` objects which have the following structure: `{filename, deadLinks}`.

**Note:** This task ignores webp files.

#### `createDeadLinksReport(deadLinksByFiles)`

* **deadLinksByFiles** - Array of `DeadLinksByFile` objects

Creates a csv string out of a list of `DeadLinksByFile` objects. The output from `checkForInternalDeadLinks()` can be piped into.

#### `createOrUpdateStack({stackName, cloudFormationTemplate})`

* **stackName** - Name of the AWS stack
* **cloudFormationTemplate** - String of the cloud formation template body

This is a simplified Node.js version of [Stacker.create_or_update_stack](https://github.com/Scout24/autostacker24#create-or-update) from [AutoStacker24](https://github.com/Scout24/autostacker24). It automatically differentiates between creates and updates and also does not complain if there is nothing to update.

#### `minifyImages({srcFolder, destFolder, quality = 70, imageminPlugins, reportingCallback})`

* **srcFolder** - The folder which is scanned for jpeg files
* **destFolder** - The folder which the opzimized files are written to
* **quality** - The quality which is passed to imagemin
* **imageminPlugins** - Array of imagemin plugins to be executed
* **reportingCallback** - Function which is called with progress information

Creates a mozjpeg optimized version and a webp file in `destFolder` for every jpeg file found inside `srcFolder`.

**Note:** The imagemin plugin modules are currently passed in from the outside because they take quite long to install. This is done to reduce the installation duration of this module.

#### `uploadCustomRedirectObjects({s3BucketName, redirectsFolder})`

* **s3BucketName** - The name of the target S3 bucket
* **redirectsFolder** - The folder containing redirect csv files for every FQDN

Creates custom 301 redirects using 0 byte S3 objects and the `x-amz-website-redirect-location` metadata property.
The `redirectsFolder` is scanned for csv files which must have the FQDN as filename (example: `www.autoscout24.de.csv`).
The first column is the url FROM which will be redirected and the second column is the url TO which will be redirected.

Example:

`"moto/speling-error","moto/spelling-error"`

#### `uploadTrailingSlashRedirectObjects({s3BucketName, rootFolder})`

* **s3BucketName** - The name of the target S3 bucket
* **rootFolder** - The folder containing all html files

Creates zero byte S3 objects for every folder inside `rootFolder` without trailing slashes for 301 redirects to the correct url in case of missing trailing slashes.
