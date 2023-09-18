#!/bin/bash
set -e

while true; do
  echo "#############  Seeding #############"

  read -p "Do you want to seed the database? [y/N] " yn
  # default value to no
  yn=${yn:-N}

  case $yn in
  [yY])
    break
    ;;
  [nN])
    clear
    echo "############# Escape seeding #############"
    echo ""
    exit
    ;;
  *) ;;

  esac

done
clear
echo "#############  Seeding in progress... #############"
npx nestjs-command seed
clear
echo "#############  Seeding done #############"
echo ""
