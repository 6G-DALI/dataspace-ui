#!/bin/sh
# Renders /usr/share/nginx/html/config.js from the environment at container
# start, so one image serves any deployment. The official nginx image runs the
# executables in /docker-entrypoint.d in order before starting nginx; 40- runs
# after its envsubst step (20-) that renders the CSP.
#
# The VITE_* names are the ones dataops-ui and portal-ui use, so one set of
# variables configures every 6G-DALI front end. Only variables that are set are
# written; the rest fall back to the defaults compiled into src/config.ts.
set -eu

TARGET=/usr/share/nginx/html/config.js

# A config.js bind-mounted read-only wins over the environment.
if [ -e "$TARGET" ] && ! [ -w "$TARGET" ]; then
  echo "40-catalogue-config.sh: $TARGET is not writable (mounted override?) - leaving it untouched"
  exit 0
fi

# Escape for a single-quoted JS string literal: backslash first, then quote.
esc() {
  printf '%s' "$1" | sed -e 's/\\/\\\\/g' -e "s/'/\\\\'/g"
}

emitted=0
tmp=$(mktemp)
{
  echo "/* Generated at container start by 40-catalogue-config.sh - do not edit. */"
  echo "window.__DALI_CONFIG__ = {"
} > "$tmp"

# key:variable pairs. Keep in step with envKeys in src/config.ts.
for pair in \
  'daliUrl:VITE_DALI_URL' \
  'portalUrl:VITE_PORTAL_URL' \
  'dataspaceUrl:VITE_DATASPACE_URL' \
  'dataopsUrl:VITE_DATAOPS_URL' \
  'mlopsUrl:VITE_MLOPS_URL' \
  'searchApiUrl:VITE_SEARCH_API_URL' \
  'repoApiUrl:VITE_REPO_API_URL' \
  'modelsCatalogue:VITE_MODELS_CATALOGUE' \
  'servicesCatalogue:VITE_SERVICES_CATALOGUE' \
  'authUrl:VITE_AUTH_URL' \
  'keycloakRealm:VITE_KEYCLOAK_REALM' \
  'keycloakClientId:VITE_KEYCLOAK_CLIENT_ID'
do
  key=${pair%%:*}
  var=${pair#*:}
  value=$(eval "printf '%s' \"\${$var:-}\"")
  if [ -n "$value" ]; then
    printf "  %s: '%s',\n" "$key" "$(esc "$value")" >> "$tmp"
    emitted=$((emitted + 1))
  fi
done

echo "}" >> "$tmp"

if [ "$emitted" -eq 0 ]; then
  echo "40-catalogue-config.sh: no VITE_* variables set - keeping the image's config.js"
  rm -f "$tmp"
  exit 0
fi

cat "$tmp" > "$TARGET"
rm -f "$tmp"
echo "40-catalogue-config.sh: wrote $TARGET with $emitted value(s) from the environment"
