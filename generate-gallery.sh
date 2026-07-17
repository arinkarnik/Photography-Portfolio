#!/bin/bash

# Auto Generate Photo Gallery List locally (replicates the GitHub Actions step)
echo "{" > gallery.json
first_folder=true
for dir in images/*/; do
  if [ -d "$dir" ]; then
    folder_name=$(basename "$dir")
    if [ "$first_folder" = true ]; then
      first_folder=false
    else
      echo "," >> gallery.json
    fi
    echo "  \"$folder_name\": [" >> gallery.json
    first_file=true
    find "$dir" -type f \( -iname "*.webp" -o -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) | sort | while read -r file; do
      if [ "$first_file" = true ]; then
        first_file=false
      else
        echo "," >> gallery.json
      fi
      clean_path=$(echo "$file" | sed 's/\\/\\\\/g' | sed 's/"/\\"/g')
      echo "    \"$clean_path\"" >> gallery.json
    done
    echo "  ]" >> gallery.json
  fi
done
echo "}" >> gallery.json

echo "Locally generated gallery.json successfully!"
