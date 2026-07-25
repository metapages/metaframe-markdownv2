set shell               := ["bash", "-c"]
set dotenv-load         := true
set export              := true
APP_FQDN                := env_var_or_default("APP_FQDN", "server1.localhost")
APP_PORT                := env_var_or_default("APP_PORT", "4430")
APP_PORT_BROWSER        := env_var_or_default("APP_PORT_BROWSER", "4440")
DENO_DEPLOY_TOKEN       := env_var_or_default("DENO_DEPLOY_TOKEN", "")
# minimal formatting, bold is very useful
bold                               := '\033[1m'
normal                             := '\033[0m'
green                              := "\\e[32m"
yellow                             := "\\e[33m"
blue                               := "\\e[34m"
magenta                            := "\\e[35m"
grey                               := "\\e[90m"

@_help:
    echo -e ""
    just --list --unsorted --list-heading $'🤖 Commands:\n\n'
    echo -e ""
    echo -e "    Publish URL 🔗        {{green}}https://markdownv2.mtfm.io{{normal}}"
    echo -e "    Github  URL 🔗        {{green}}$(cat editor/package.json | jq -r '.repository.url'){{normal}}"
    echo -e "    Develop URL 🔗        {{green}}https://{{APP_FQDN}}:{{APP_PORT}}/{{normal}}"
    echo -e "    Deploy Console URL 🔗 {{green}}https://console.deno.com/metapage/metaframe-markdown{{normal}}"
    echo -e ""


# open
# Run the server in development mode
@dev +args="": _mkcert open
  docker compose up {{args}}

# Shut down the local server
@down +args="":
  docker compose down {{args}}

# DEV: generate TLS certs for HTTPS over localhost https://blog.filippo.io/mkcert-valid-https-certificates-for-localhost/
@_mkcert:
  if [ ! -f .traefik/certs/local-key.pem ]; then \
      mkdir -p .traefik/certs ; \
      mkcert -cert-file .traefik/certs/local-cert.pem -key-file .traefik/certs/local-key.pem {{APP_FQDN}} localhost ; \
  fi

open:
  deno run --allow-all --unstable https://deno.land/x/metapages@v0.0.17/exec/open_url.ts 'https://metapages.github.io/load-page-when-available/?url=https://{{APP_FQDN}}:{{APP_PORT}}'

alias publish := deploy

# Build the client and assemble the deployable bundle in DEST.
# DEST is deliberately outside the repo: `deno deploy` honours .gitignore, so
# staging into an ignored in-repo dir silently uploads nothing.
_stage DEST:
  #!/usr/bin/env bash
  set -euo pipefail
  # build the client in editor/dist
  just editor/build
  cp -r editor/dist {{DEST}}/editor
  cp -r worker/server.ts {{DEST}}/
  cp -r worker/deno.json {{DEST}}/
  cp -r worker/deno.lock {{DEST}}/
  cp -r worker/index.html {{DEST}}/
  cp -r worker/public {{DEST}}/

# deno deploy to markdownv2.mtfm.io (app: metapage/metaframe-markdown)
deploy:
  #!/usr/bin/env bash
  set -euo pipefail
  deploy=$(mktemp -d)
  just _stage $deploy
  cd $deploy
  # Keep the log out of $deploy: everything in there gets uploaded.
  log=$(mktemp)
  # `deno deploy` (jsr:@deno/deploy) intermittently hangs mid-upload and is then
  # killed by Deno's top-level-await watchdog with exit 1, even when nothing is
  # wrong. Deploys create a fresh revision each time, so retry and treat the run
  # as successful only when the CLI prints its genuine confirmation line.
  attempts=3
  for i in $(seq 1 $attempts); do
    echo -e "{{blue}}deno deploy attempt $i/$attempts{{normal}}"
    set +e
    timeout 420 deno deploy --prod 2>&1 | tee $log
    code=${PIPESTATUS[0]}
    set -e
    if grep -q "Successfully deployed your application" $log; then
      echo -e "{{green}}Deploy succeeded.{{normal}}"
      exit 0
    fi
    echo -e "{{yellow}}Deploy attempt $i did not confirm success (exit $code); retrying...{{normal}}"
    sleep 5
  done
  echo -e "{{magenta}}Deploy failed after $attempts attempts.{{normal}}"
  exit 1

# ONE-TIME: register metapage/metaframe-markdown on Deno Deploy, then use `just deploy`
create-app:
  #!/usr/bin/env bash
  set -euo pipefail
  # --do-not-use-detected-build-config is required: auto-detection sees index.html at the
  # bundle root and would create a *static* app, never running server.ts.
  deploy=$(mktemp -d)
  just _stage $deploy
  cd $deploy
  deno deploy create \
    --org metapage \
    --app metaframe-markdown \
    --source local \
    --do-not-use-detected-build-config \
    --runtime-mode dynamic \
    --entrypoint server.ts \
    --region global

# Checks and tests
@test:
  just editor/test
  just worker/test

# Delete all cached and generated files, and docker volumes
clean:
    just editor/clean
    rm -rf .traefik/certs
    docker compose down -v
