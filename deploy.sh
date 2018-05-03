#!/bin/bash

#docker login
docker build -t teamtrack .
#docker tag teamtrack jova/teamtrack
#docker push jova/teamtrack
docker tag teamtrack gcr.io/teamtrack-api/api:v1

gcloud docker -- push gcr.io/teamtrack-api/api:v1

#gcloud components install kubectl
#gcloud init

#gcloud config set project teamtrack-api
#gcloud container clusters create teamtrack-cluster --zone us-east1-b --machine-type f1-micro --num-nodes 3 --network default
gcloud container clusters get-credentials teamtrack-cluster --zone us-east1-b

kubectl apply \
    -f k8s/api-deployment.yml \
    -f k8s/api-service.yml \
    -f k8s/db-deployment.yml \
    -f k8s/db-service.yml \
    -f k8s/db-admin-service.yml \
    --record
