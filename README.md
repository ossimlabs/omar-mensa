# omar-mensa

## Description

Tme OMAR Mensuration service receives and handles all user measurement (e.g. area, length, etc.) requests for a particular image.

[![Build Status](https://jenkins.radiantbluecloud.com/buildStatus/icon?job=omar-mensa-dev)]()

### Required environment variable
- OMAR_COMMON_PROPERTIES

### Optional environment variables
Only required for Jenkins pipelines or if you are running Artifactory and/or Openshift locally

- OPENSHIFT_USERNAME
- OPENSHIFT_PASSWORD
- ARTIFACTORY_USER
- ARTIFACTORY_PASSWORD

## How to Install omar-mensa-app locally

1. Install omar-oms-plugin [click this link for instructions](https://github.com/ossimlabs/omar-oms)

2. Git clone the following repos or git pull the latest versions if you already have them.
```
  git clone https://github.com/ossimlabs/omar-mensa.git
```

3. Install omar-mensa-plugin
```
 cd omar-mensa/plugin/omar-mensa-plugin
 gradle clean install
```

4. Build/Install omar-mensa-app
#### Build:
```
 cd omar-mensa/apps/omar-mensa-app
 gradle clean build
 ```
#### Install:
```
 cd omar-mensa/apps/omar-mensa-app
 gradle clean install
```
