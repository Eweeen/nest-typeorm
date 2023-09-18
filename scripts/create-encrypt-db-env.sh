#!/bin/bash
set -e

example=encrypt-db.env.example
final=encrypt-db.env

while true; do
  echo "#############  Encrypt Environment #############"

  if [ -f "$final" ]; then

    read -p "$final already exists. Overwrite? [y/N] " yn
    # default value to no
    yn=${yn:-N}

    case $yn in
    [yY])
      rm $final
      break
      ;;
    [nN])
      clear
      echo "############# Escape encrypt Environment #############"
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
clear
echo "############# encrypt-db.env generation in progress... #############"
>$final
while read -r line; do
  # Checking if the line starts with a # or if the line is empty. If it does, it skips the line.
  if [[ "$line" =~ ^\#.*$ || -z "$line" || "$line" == *"ENCRYPTION_ALGORITHM"* || "$line" == *"ENCRYPTION_IV_LENGTH" ]]; then
    echo "$line" >>"$final"
    continue
  fi

  DATA=""
  if [[ "$line" == *"ENCRYPTION_KEY"* ]]; then
    DATA=$(openssl rand -hex 32)
  elif [[ "$line" == *"ENCRYPTION_IV"* && "$line" != *"ENCRYPTION_IV_LENGTH"* ]]; then
    DATA=$(openssl rand -hex 24)
  fi

  final_line="$line$DATA"
  echo "$final_line" >>"$final"

done <"$example"
clear
echo "############# encrypt-db.env generation done #############"
echo ""
