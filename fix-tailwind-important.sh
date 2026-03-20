#!/bin/bash

# Fix Tailwind v4 important modifier syntax
# Convert class-name! to !class-name

# Find all TypeScript/TSX files and fix the syntax
find src -type f \( -name "*.tsx" -o -name "*.ts" \) | while read file; do
  # Fix patterns like size-3.5! to !size-3.5
  sed -i '' -E 's/([[:space:]"\(])([a-zA-Z0-9\-\.]+)!/\1!\2/g' "$file"
  
  # Fix patterns in className strings that might have been missed
  sed -i '' -E 's/"([^"]*[[:space:]])([a-zA-Z0-9\-\.]+)!([[:space:]][^"]*)"/"!\2\1\3"/g' "$file"
done

echo "Fixed Tailwind important modifier syntax in all files"
