#!/usr/bin/env bash
# exit on error
set -o errexit

# Install root dependencies with yarn
yarn

# Install client dependencies and build with yarn
cd client
yarn
yarn build
cd ..
