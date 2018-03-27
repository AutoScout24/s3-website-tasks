# S3 website tasks

[![Build Status](https://travis-ci.org/Scout24/s3-website-tasks.svg?branch=master)](https://travis-ci.org/Scout24/s3-website-tasks)

## Description

Node.js build tasks for a multilingual website hosted in S3.

## Project requirements

The tasks require the consuming website project to have the following setup:

* The website provides different country versions per top level domain
* Content URL paths may be prefixed by a general or country specific url path prefix
* Assets URL paths start with `/assets` and may have an assets url path prefix afterwards
* Both content and assets URL path prefixes may only contain of one path component
* All countries are in the same S3 bucket separated by subdirectories with TLD as name
* The S3 bucket uses static website hosting with `index.html` as Index Document
* All content pages have the name `index.html`

### Artifacts directory layout

The artifacts directory and the S3 bucket must have the following directory layout:

  * **assets/**: all assets
  * **content/**
    * **de/**: content for germany
    * **it/**: content for italy
    * **be/**: content for belgium
      * **fr/**: french content for belgium
      * **nl/**: dutch content for belgium

### URL rewrites

The tasks assume a proxy server in front of S3 which rewrites all URLs correctly (such as nginx of CloudFront).

**Without** URL path prefixes the required rewrite patterns are:

| Original URL | Rewritten URL |
| --- | --- |
| https://3LD.2LD.TLD/PATH/ | http://BUCKET-NAME.s3-website-AWS-REGION.amazonaws.com/content/TLD/PATH |
| https://3LD.2LD.TLD/LANG/PATH/ | http://BUCKET-NAME.s3-website-AWS-REGION.amazonaws.com/content/TLD/LANG/PATH |
| https://3LD.2LD.TLD/assets/PATH | http://BUCKET-NAME.s3-website-AWS-REGION.amazonaws.com/assets/PATH |

**With** URL path prefixes (for content and assets) the required rewrite patterns are:

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

#### `checkForInternalDeadLinks({rootDirectory, thirdLevelDomain, secondLevelDomain, urlPathPrefixes})`

* **rootDirectory** - Directory to be scanned for html files
* **thirdLevelDomain** - Third level domain of the FQDN (default: www)
* **secondLevelDomain** - Second level domain of the FQDN (e.g. autoscout24)
* **urlPathPrefixes** - Optional array of URL path prefixes (both content and assets, default: \[\])
* **filesChunkSize** - Optional chunk size for files to be processed concurrently (default: 1000)

Scans all html files found in `rootDirectory` for internal dead links. Both relative and absolute urls are taking into account.  **Relative URLs are only supported for paths starting with /**. Links are internal if at least their `thirdLevelDomain` and `secondLevelDomain` match the provided arguments. Additionally, if `urlPathPrefixes` are provided a link URL path needs to start with one of them to count as internal.

The function yields a list `DeadLinksByFile` objects which have the following structure: `{filename, deadLinks}`.

**Note:** This task ignores webp files.

#### `createDeadLinksReport(deadLinksByFiles)`

* **deadLinksByFiles** - Array of `DeadLinksByFile` objects

Creates a csv string out of a list of `DeadLinksByFile` objects. The output from `checkForInternalDeadLinks()` can be piped into.

#### `createCustomRedirectDefinitions({thirdLevelDomain, secondLevelDomain, redirectsDirectory})`

* **redirectsDirectory** - The directory containing redirect csv files for every FQDN
* **thirdLevelDomain** - Third level domain of the FQDN (default: www)
* **secondLevelDomain** - Second level domain of the FQDN (e.g. autoscout24)
* **urlPathPrefixes** - Optional array of url path prefixes (both content and assets)

Creates custom redirect definitions to upload 0 byte S3 objects for 301 redirects using `x-amz-website-redirect-location` metadata. The `redirectsDirectory` is scanned for csv files which must have the TLD as filename (example: `de.csv`). The first column is the url FROM which is redirected and the second column the url TO which is redirected. The `thirdLevelDomain` abd `secondLevelDomain` parameters are required in order to construct the correct redirect URL. The optional `urlPathPrefixes` are used to remove URL path prefixes from the resulting S3 object keys.

**Note:** This function assumes HTTPS as protocol.

The function yields a list of `RedirectDefinition` objects which have the following structure: `{s3Key, redirectUrl}`.

Example csv file format:

`"moto/speling-error","moto/spelling-error"`

#### `createTrailingSlashRedirectDefinitions({thirdLevelDomain, secondLevelDomain, urlPathPrefixMap, rootDirectory})`

* **rootDirectory** - The directory containing all html files
* **thirdLevelDomain** - Third level domain of the FQDN (default: www)
* **secondLevelDomain** - Second level domain of the FQDN (e.g. autoscout24)
* **urlPathPrefixMap** - Optional url path prefix map to use for redirects

Creates trailing slash redirect definitions for all directories inside `rootDirectory`. The `thirdLevelDomain`, `secondLevelDomain` and the optional `urlPathPrefixMap` parameters are used to construct the correct redirect URL. The respective resulting key is the same as the according directory but without the trailing slash. The definitions can be used to upload 0 byte objects to S3 for 301 redirects using the `x-amz-website-redirect-location` metadata property.

The optional `urlPathPrefixMap` is list of objects with the following structure: `{key, value}`. The key is the TLD, eventually followed by a slash and lang code (e.g. be/nl). The character `*` can be used as key for a generic path prefix for TLDs/languages. The value is the path prefix to use for URL construction. If no suitable URL path prefix map entry is found, it is assumed that there is no URL path prefix.

Example prefix map:

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

#### `minifyImages({srcDirectory, destDirectory, quality = 70, imageminPlugins, reportingCallback})`

* **srcDirectory** - The directory which is scanned for jpeg files
* **subdirectories** - Optional list of subdirectories to process
* **destDirectory** - The directory which the opzimized files are written to
* **quality** - The quality which is passed to imagemin
* **imageminPlugins** - Array of imagemin plugins to be executed
* **reportingCallback** - Function which is called with progress information

Executes all given imagemin plugins for all images within `srcDirectory` and outputs the resulting files into `destDirectory`. Since imagemin is not capable of preserving the directory tree for nested directories this task processes every subdirectory individually. If a list of `subdirectories` is provided only these are processed. **Note:** The provided subdirectories must be absolute paths.
