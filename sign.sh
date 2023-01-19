#!/bin/bash

# folder with files $1 is version
folder=./dist/$1

# get only files with app name
files=$(find "$folder" -maxdepth 1 -name "*.deb" -o -name "*.snap" -o -name "*.exe" -o -name "*.AppImage")

for file in $files
do
  # get file name
  filename=$(basename "$file")
  echo $filename

  # sign file
  gpg --detach-sign --armor --local-user D4EE9ABB9B82D5CE --output $folder/$filename.asc $folder/$filename

  # verify signature
  output=$(gpg --verify $folder/$filename.asc $folder/$filename)

  echo "$output"

  if echo "$output" | grep -q "Bad signature"
  then
    exit 1
  fi
done
