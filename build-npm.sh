#!/usr/bin/env bash
# exit on error
set -o errexit

# Install root dependencies with npm
npm install --production=false

# Install client dependencies and build with npm
cd client
npm install
npm run build
cd ..
