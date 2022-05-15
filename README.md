# Smithsoft Site

A Gatsby transform from WordPress React-app.

## Deploy

[![Netlify Status](https://api.netlify.com/api/v1/badges/199337a3-0930-4b9f-8d67-043d33643661/deploy-status)](https://app.netlify.com/sites/vigilant-euler-79203e/deploys)

### Google Free Tier

* Compute Engine: 1 x `e2-micro` in
* `us-west1`, `us-central1` or `us-east1`
* 30 GB HDD
* 1 GB network egress
* 5 GB snapshot storage

[Compute engine free tier](https://cloud.google.com/free/docs/gcp-free-tier?hl=fi#free-tier-usage-limits) does not include external IP address

## Html-React-Parser

For now this project is using [HTML React Parser](https://github.com/remarkablemark/html-react-parser).  There's a similarly named project [React HTML Parser](https://github.com/wrakky/react-html-parser) that does the same thing.

It looks as though the former one is [smaller, better at updates & issues and has more stars](https://www.npmtrends.com/html-react-parser-vs-react-html-parser-vs-react-render-html) so for now that's the one being used.

## Google Cloud

Use `gcloud` to manage the VM that hosts the WordPress instance.  Its usually not running in order to save money on hosting fees.

### Pre-requisites

* [Python 3.7](https://www.freecodecamp.org/news/python-version-on-mac-update/)
* [Gcloud tool](https://cloud.google.com/sdk/docs/quickstart)

### First time

* Go [download the latest version of the cloud tool from Google](https://cloud.google.com/sdk/docs/quickstart#installing_the_latest_version).

```
cd build
tar zxvf google-cloud-sdk-353.0.0-darwin-x86_64.tar.gz
./google-cloud-sdk/install.sh
```

* Open a new Shell (to get the updated environment)

```
gcloud init
```

### Subsequent times

* Login and set default project, region & zone

```
gcloud auth login
gcloud config set project smithsoft-web
gcloud config set compute/region us-west1
gcloud config set compute/zone us-west1-b
```

* Interrogate current config and information

```
gcloud auth list
gcloud config list
```

* List available instances and get information

```sh
gcloud compute instances list
```

```sh
gcloud info
gcloud history
```

### Stopping and Starting

* [Reference docs for stopping & starting](https://cloud.google.com/compute/docs/instances/stop-start-instance#gcloud_1)


```sh
# start the VM
gcloud compute instances start wordpress-graphql
```

```sh
# stop the VM
gcloud compute instances stop wordpress-graphql
```

```sh
# ssh into the VM
gcloud compute ssh wordpress-graphql
```

## Deploy to Netlify

Ensure Netlify command line tool is installed:

```
npm install netlify-cli -g
```

Log in to Netlify:

```
netlify login
```

Deploy to Netlify:

```
netlify deploy
```

### Admin of Wordpress Instance

* See [Wordpress admin readme](wordpress-admin.md)Please never add secrets to this repo
