#!/bin/bash
set -e

echo "#############  Build in progress... #############"
pnpm build
clear
echo "#############  Build done #############"
echo ""
echo "#############  Migration in progress... #############"
pnpm typeorm migration:run
clear
echo "#############  Migration done #############"
echo ""
echo "#############  Build in progress... #############"
pnpm build
clear
echo "#############  Build done #############"
echo ""
