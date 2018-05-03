#!/bin/bash

#docker login
docker build -t teamtrack .
#docker tag teamtrack jova/teamtrack
#docker push jova/teamtrack
docker tag teamtrack gcr.io/teamtrack-api/api:v1
