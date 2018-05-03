#!/bin/bash

gcloud docker -- push gcr.io/teamtrack-api/api:v1

#gcloud components install kubectl
#gcloud init

gcloud components update

gcloud config set project teamtrack-api

gcloud container clusters create teamtrack-cluster \
    --zone northamerica-northeast1-a \
    --machine-type n1-standard-2 \
    --num-nodes 3 \
    --enable-autoscaling \
    --min-nodes 1 \
    --max-nodes 3 \
    --network default

gcloud container clusters get-credentials teamtrack-cluster --zone northamerica-northeast1-a

kubectl apply \
    -f k8s/api-deployment.yml \
    -f k8s/api-service.yml \
    -f k8s/db-deployment.yml \
    -f k8s/db-service.yml \
    -f k8s/db-admin-service.yml \
    -f k8s/redis-deployment.yml \
    -f k8s/redis-service.yml \
    --record
