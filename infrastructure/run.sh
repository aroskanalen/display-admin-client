#!/bin/sh

APP_VERSION=develop
VERSION=alpha

docker build --no-cache --build-arg APP_VERSION=${APP_VERSION} --tag=itkdev/os2display-api-admin:${VERSION} --file="Dockerfile" .

#docker push itkdev/os2display-api-admin:${VERSION}
