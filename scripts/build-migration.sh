#!/bin/bash
set -e

echo "#############  Build in progress... #############"
pnpm run build
clear
echo "#############  Build done #############"
echo ""
echo "#############  Migration in progress... #############"
pnpm run typeorm migration:run
clear
echo "#############  Migration done #############"
echo ""
echo "#############  Build in progress... #############"
pnpm run build
clear
echo "#############  Build done #############"
echo ""