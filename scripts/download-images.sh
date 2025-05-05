#!/bin/bash

# Create directory if it doesn't exist
mkdir -p public/images/products

# Function to download an image
download_image() {
  local category=$1
  local name=$2
  local width=$3
  local height=$4
  local url="https://via.placeholder.com/${width}x${height}?text=${name}"
  local output="public/images/products/${name}.jpg"
  
  echo "Downloading ${name}.jpg..."
  curl -s "$url" -o "$output"
}

# Download electronics images
download_image "electronics" "calculator" 300 200
download_image "electronics" "laptop" 300 200
download_image "electronics" "headphones" 300 200
download_image "electronics" "monitor" 300 200

# Download book images
download_image "books" "textbook-chem" 300 200
download_image "books" "textbook-math" 300 200
download_image "books" "textbook-bio" 300 200
download_image "books" "novel" 300 200

# Download clothing images
download_image "clothing" "hoodie" 300 200
download_image "clothing" "tshirt" 300 200
download_image "clothing" "jeans" 300 200
download_image "clothing" "jacket" 300 200

# Download furniture images
download_image "furniture" "desk" 300 200
download_image "furniture" "chair" 300 200
download_image "furniture" "lamp" 300 200
download_image "furniture" "shelf" 300 200

# Download school supplies images
download_image "supplies" "backpack" 300 200
download_image "supplies" "notebooks" 300 200
download_image "supplies" "pens" 300 200
download_image "supplies" "organizer" 300 200

# Download dorm essentials images
download_image "dorm" "microwave" 300 200
download_image "dorm" "mini-fridge" 300 200
download_image "dorm" "coffee-maker" 300 200
download_image "dorm" "electric-kettle" 300 200

# Download default images
download_image "default" "default1" 300 200
download_image "default" "default2" 300 200
download_image "default" "default3" 300 200
download_image "default" "default4" 300 200

# Bolsas
download_image "bolsas" "bolsa1" 300 200
download_image "bolsas" "bolsa2" 300 200
download_image "bolsas" "bolsa3" 300 200

# Pins
download_image "pins" "pin1" 300 200
download_image "pins" "pin2" 300 200
download_image "pins" "pin3" 300 200
echo "All images downloaded successfully!" 