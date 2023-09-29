#!/bin/bash
set -e

clear
sh scripts/jwt-keygen.sh
echo "#############  Dependencies installation in progress... #############"
bun install
clear
echo "#############  Dependencies installation done #############"
echo ""
sh scripts/create-encrypt-db-env.sh
sh scripts/build-migration.sh
sh scripts/seeding-db.sh
bun run start:dev
