#!/bin/bash
set -e

key=jwt/id_rsa

while true; do
  echo "#############  JWT Keygen #############"

  if [ -f "$key" ]; then

    read -p " Keys already exists. Overwrite? [y/N] " yn
    # default value to no
    yn=${yn:-N}

    case $yn in
    [yY])
      break
      ;;
    [nN])
      clear
      echo "#############  Escape JWT Keygen #############"
      echo ""
      exit
      ;;
    *) ;;

    esac
  else
    break
  fi
done

# User agree to proceed
echo "#############  Keys generation in progress... #############"
[ ! -d jwt ] && mkdir jwt
touch jwt/.gitkeep
ssh-keygen -t rsa -b 2048 -m PEM -f jwt/id_rsa -P ''
openssl rsa -in jwt/id_rsa -pubout -outform PEM -out jwt/id_rsa.pub

clear
echo "#############  Keys generation done #############"
echo ""
