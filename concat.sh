#!/bin/bash

# Delete old files
rm gShop.full.js
rm gShop.min.js

# Create two separate files out of vitals.js
cat vitals.js | sed -e '/{INSERT}/,$d' > vitals1
cat vitals.js | sed -e '1,/{INSERT}/d' > vitals2

# Concat all files
cat main.js >> temp
cat items.js >> temp
cat userData.js >> temp
cat sync.js >> temp
cat vitals1 >> gShop.full.js
cat temp >> gShop.full.js
cat vitals2 >> gShop.full.js
rm temp
sed '/\/\*.*\*\// d; /\/\*/,/\*\// d' gShop.full.js > gShop.min.js
rm vitals1
rm vitals2