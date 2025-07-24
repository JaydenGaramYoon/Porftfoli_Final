#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies
npm install

# Install client dependencies and build
cd client
npm install
npm run build
cd ..
