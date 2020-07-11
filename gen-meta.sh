#!/bin/bash

for userjs in *.user.js; do
  scriptName=${userjs::-8}
  metajs=${scriptName}.meta.js
  sed -n '1,/^\/\/\s*==\/UserScript==/p' ${userjs} > ${metajs}
done
