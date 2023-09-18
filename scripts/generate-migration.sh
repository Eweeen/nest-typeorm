#!/bin/bash
set -e

echo "#############  Build in progress... #############"
pnpm run build
clear
echo "#############  Build done #############"
echo ""
echo "#############  Migration in progress... #############"
pnpm typeorm migration:generate src/migrations/$1
clear
echo "#############  Migration done #############"
echo ""
echo "#############  Build in progress... #############"
pnpm run build
clear
echo "#############  Build done #############"
echo ""
