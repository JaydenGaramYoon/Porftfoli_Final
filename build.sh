#!/usr/bin/env bash
# exit on error
set -o errexit

# Set yarn network timeout and retry settings
yarn config set network-timeout 300000
yarn config set network-concurrency 1

# Install root dependencies with yarn
yarn install --frozen-lockfile --network-timeout 300000

# Install client dependencies and build with yarn
cd client
yarn install --frozen-lockfile --network-timeout 300000
yarn build
cd ..
