#!/bin/bash
set -e

echo "#############  Build in progress... #############"
bun run build
clear
echo "#############  Build done #############"
echo ""
echo "#############  Migration in progress... #############"
bun run typeorm migration:run
clear
echo "#############  Migration done #############"
echo ""
echo "#############  Build in progress... #############"
bun run build
clear
echo "#############  Build done #############"
echo ""
