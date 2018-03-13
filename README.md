# S3 website tasks

[![Build Status](https://travis-ci.org/Scout24/s3-website-tasks.svg?branch=master)](https://travis-ci.org/Scout24/s3-website-tasks)

## Description

Node.js build tasks for a multilingual website hosted in S3.

## Project requirements

The tasks require the consuming website project to have the following setup:

* The website provides different country versions per top level domain
* The website is identified by one or more url path prefixes
* Content urls start with https://3LD.2LD.TLD/CONTENT-PATH-PREFIX/
* Assets urls start with https://3LD.2LD.TLD/assets/ASSETS-PATH-PREFIX/
* All countries are in the same S3 bucket separated by subfolders with TLD as name
* The S3 bucket uses static website hosting with `index.html` as Index Document
* All content pages have the name `index.html`

### Artifacts directory layout

The artifacts folder and the S3 bucket must have the following directory layout:

  * **assets/**: all assets
  * **content/**
    * **de/**: content for germany
    * **it/**: content for italy
    * **be/**: content for belgium
      * **fr/**: french content for belgium
      * **nl/**: dutch content for belgium

### URL rewrites

The tasks assume a proxy server in front of S3 which rewrites all URLs correctly (such as nginx of CloudFront).

The required URL rewrite patterns are:

| Original URL | Rewritten URL |
| --- | --- |
| https://3LD.2LD.TLD/CONTENT-PATH-PREFIX/PATH/ | http://BUCKET-NAME.s3-website-AWS-REGION.amazonaws.com/content/TLD/PATH |
| https://3LD.2LD.TLD/LANG/CONTENT-PATH-PREFIX/PATH/ | http://BUCKET-NAME.s3-website-AWS-REGION.amazonaws.com/content/TLD/LANG/PATH |
| https://3LD.2LD.TLD/assets/ASSETS-PATH-PREFIX/PATH | http://BUCKET-NAME.s3-website-AWS-REGION.amazonaws.com/assets/PATH |

AutoScout24 example of the seo auto catalogue:

| Original URL | Rewritten URL |
| --- | --- |
| https://www.autoscout24.de/auto/bmw/ | http://as24-seo-pages-auto.s3-website-eu-west-1.amazonaws.com/content/de/bmw/ |
| https://www.autoscout24.fr/voiture/bmw/ | http://as24-seo-pages-auto.s3-website-eu-west-1.amazonaws.com/content/fr/bmw/ |
| https://www.autoscout24.be/nl/auto/bmw/ | http://as24-seo-pages-auto.s3-website-eu-west-1.amazonaws.com/content/be/nl/bmw/ |
| https://www.autoscout24.de/assets/auto/images/foobar.jpg | http://as24-seo-pages-auto.s3-website-eu-west-1.amazonaws.com/assets/images/foobar.jpg |

## Tasks

All tasks return a `Promise` object.

#### `checkForInternalDeadLinks({rootFolder, secondLevelDomain, urlPathPrefixes})`

* **rootFolder** - Folder which will be scanned for html files
* **secondLevelDomain** - Second level domain of the FQDN (e.g. autoscout24)
* **thirdLevelDomain** - Third level domain of the FQDN (default: www)
* **urlPathPrefixes** - Array of url path prefixes used for the service/website

Scans all html files found in `rootFolder` for internal dead links. Both relative urls and urls containing the `thirdLevelDomain` and `secondLevelDomain` are taken into account. **Relative URLs only support paths starting with /**. Links are considered internal if their url path start with one of the `urlPathPrefixes` array.

The function yields a list `DeadLinksByFile` objects which have the following structure: `{filename, deadLinks}`.

**Note:** This task ignores webp files.

#### `createDeadLinksReport(deadLinksByFiles)`

* **deadLinksByFiles** - Array of `DeadLinksByFile` objects

Creates a csv string out of a list of `DeadLinksByFile` objects. The output from `checkForInternalDeadLinks()` can be piped into.

#### `createCustomRedirectDefinitions(redirectsFolder)`

* **redirectsFolder** - The folder containing redirect csv files for every FQDN

Creates custom redirect definitions which can be used to upload 0 byte objects to S3 for 301 redirects using the `x-amz-website-redirect-location` metadata property. The `redirectsFolder` is scanned for csv files which must have the FQDN as filename (example: `www.autoscout24.de.csv`). The first column must be the url FROM which should be redirected and the second column the url TO which should be redirected.

**Note:** This function assumes HTTPS as protocol.

The function yields a list of `RedirectDefinition` objects which have the following structure: `{s3Key, redirectUrl}`.

Example csv file format:

`"moto/speling-error","moto/spelling-error"`

#### `createTrailingSlashRedirectDefinitions({fqdn, urlPathPrefixMap, rootFolder})`

* **secondLevelDomain** - Second level domain of the FQDN (e.g. autoscout24)
* **thirdLevelDomain** - Third level domain of the FQDN (default: www)
* **urlPathPrefixMap** - The url path prefix map to use for redirects
* **rootFolder** - The folder containing all html files

Creates trailing slash redirect definitions for all folders inside `rootFolder`. The `thirdLevelDomain`, `secondLevelDomain` and `urlPathPrefixMap` parameters are required in order to construct the correct redirect URL. The respective resulting key is the same as the according folder but without the trailing slash. The definitions can be used to upload 0 byte objects to S3 for 301 redirects using the `x-amz-website-redirect-location` metadata property.

The `urlPathPrefixMap` must be a list of objects with the following structure: `{key, value}`. The key is the TLD, optionally followed by a slash and lang code (e.g. be/nl). The character `*` can be used as key for a generic path prefix for TLDs/languages. The value is the path prefix to use for URL construction. Example:

```
[
  {key: '*', value: 'auto'},
  {key: 'fr', value: 'voiture'},
  {key: 'be/fr', value: 'voiture'}
]
```

The function yields a list of `RedirectDefinition` objects which have the following structure: `{s3Key, redirectUrl}`.

**Note:** This function automatically assumes HTTPS as protocol.

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
