#!/bin/bash

wget -O - https://raw.githubusercontent.com/tinoschroeter/k8s.homelab/master/docs/README.md 2>/dev/null \
|pandoc --standalone --css style.css --metadata title="Homelab" \
--include-before-body=ribbon.html -f markdown -t html > index.html
