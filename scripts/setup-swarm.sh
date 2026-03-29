#!/usr/bin/env bash
# =============================================================================
# setup-swarm.sh — One-time Swarm + Portainer bootstrap for a DigitalOcean
# Droplet (or any Ubuntu 22.04 / 24.04 host).
#
# Run this script ONCE as root (or with sudo) on the Droplet:
#   sudo bash setup-swarm.sh
#
# What it does:
#   1. Installs Docker Engine (latest stable)
#   2. Initialises a single-node Docker Swarm
#   3. Creates the overlay networks used by docker-stack.yml
#   4. Creates Docker secrets (prompts for values interactively)
#   5. Logs in to ghcr.io so Swarm can pull private images
#   6. Deploys the initial stack from docker-stack.yml
# =============================================================================

set -euo pipefail

# ---------------------------------------------------------------------------
# Colour helpers
# ---------------------------------------------------------------------------
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Colour

info()    { echo -e "${BLUE}[INFO]${NC}  $*"; }
success() { echo -e "${GREEN}[OK]${NC}    $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC}  $*"; }
error()   { echo -e "${RED}[ERROR]${NC} $*" >&2; }

# ---------------------------------------------------------------------------
# Safety checks
# ---------------------------------------------------------------------------
if [[ "$(id -u)" -ne 0 ]]; then
  error "This script must be run as root or with sudo."
  exit 1
fi

# Detect the primary non-root user so we can add them to the docker group
SUDO_USER_NAME="${SUDO_USER:-}"

# ---------------------------------------------------------------------------
# Step 1 — Install Docker Engine
# ---------------------------------------------------------------------------
info "Step 1/6 — Installing Docker Engine..."

if command -v docker &>/dev/null; then
  DOCKER_VERSION=$(docker --version)
  warn "Docker already installed: ${DOCKER_VERSION}. Skipping installation."
else
  # Official Docker install script — safe for Ubuntu and Debian
  curl -fsSL https://get.docker.com | sh

  # Enable and start the daemon
  systemctl enable docker
  systemctl start docker

  # Add the sudo-invoking user to the docker group (avoids sudo for docker cmds)
  if [[ -n "${SUDO_USER_NAME}" ]]; then
    usermod -aG docker "${SUDO_USER_NAME}"
    info "Added '${SUDO_USER_NAME}' to the docker group. Re-login for it to take effect."
  fi

  success "Docker installed."
fi

# ---------------------------------------------------------------------------
# Step 2 — Initialise Docker Swarm
# ---------------------------------------------------------------------------
info "Step 2/6 — Initialising Docker Swarm..."

if docker info --format '{{.Swarm.LocalNodeState}}' 2>/dev/null | grep -q "active"; then
  warn "Swarm is already active. Skipping init."
else
  # Detect the host's public/private IP for Swarm advertise address
  # Prefer the DO-assigned public IP from metadata; fall back to hostname resolution
  ADVERTISE_ADDR=""
  if curl -sf --max-time 2 http://169.254.169.254/metadata/v1/interfaces/public/0/ipv4/address &>/dev/null; then
    ADVERTISE_ADDR=$(curl -sf --max-time 2 http://169.254.169.254/metadata/v1/interfaces/public/0/ipv4/address)
    info "Detected DigitalOcean public IP: ${ADVERTISE_ADDR}"
  else
    ADVERTISE_ADDR=$(hostname -I | awk '{print $1}')
    info "Using first host IP: ${ADVERTISE_ADDR}"
  fi

  docker swarm init --advertise-addr "${ADVERTISE_ADDR}"
  success "Docker Swarm initialised (manager: ${ADVERTISE_ADDR})."
fi

# ---------------------------------------------------------------------------
# Step 3 — Create overlay networks
# ---------------------------------------------------------------------------
info "Step 3/6 — Creating overlay networks..."

for NET in proxy internal; do
  if docker network inspect "${NET}" &>/dev/null; then
    warn "Network '${NET}' already exists. Skipping."
  else
    OPTS="--driver overlay"
    # proxy is attachable so Traefik can route to containers started manually
    [[ "${NET}" == "proxy" ]] && OPTS="${OPTS} --attachable"
    # shellcheck disable=SC2086
    docker network create ${OPTS} "${NET}"
    success "Created network '${NET}'."
  fi
done

# ---------------------------------------------------------------------------
# Step 4 — Create Docker secrets
# ---------------------------------------------------------------------------
info "Step 4/6 — Creating Docker secrets..."
info "Enter values when prompted. Input is hidden."

create_secret() {
  local NAME="$1"
  local PROMPT="$2"

  if docker secret inspect "${NAME}" &>/dev/null; then
    warn "Secret '${NAME}' already exists. Skipping (delete it first to update)."
    return
  fi

  local VALUE=""
  while [[ -z "${VALUE}" ]]; do
    read -rsp "  ${PROMPT}: " VALUE
    echo ""  # newline after hidden input
    if [[ -z "${VALUE}" ]]; then
      warn "Value cannot be empty. Please try again."
    fi
  done

  printf '%s' "${VALUE}" | docker secret create "${NAME}" -
  success "Created secret '${NAME}'."
}

create_secret "procurement_mongodb_username"     "MongoDB root username"
create_secret "procurement_mongodb_password"     "MongoDB root password"
create_secret "procurement_keycloak_admin"       "Keycloak admin username"
create_secret "procurement_keycloak_admin_password" "Keycloak admin password"
create_secret "procurement_keycloak_client_secret"  "Keycloak client secret"

# ---------------------------------------------------------------------------
# Step 5 — Log in to ghcr.io
# ---------------------------------------------------------------------------
info "Step 5/6 — Logging in to ghcr.io..."
info "You need a GitHub Personal Access Token (PAT) with 'read:packages' scope."
info "Create one at: https://github.com/settings/tokens/new"

read -rp "  GitHub username: " GH_USER
read -rsp "  GitHub PAT (read:packages): " GH_TOKEN
echo ""

printf '%s' "${GH_TOKEN}" | docker login ghcr.io --username "${GH_USER}" --password-stdin
success "Logged in to ghcr.io as '${GH_USER}'."

# ---------------------------------------------------------------------------
# Step 6 — Deploy the stack
# ---------------------------------------------------------------------------
info "Step 6/6 — Deploying the procurement stack..."

# Locate docker-stack.yml relative to this script (repo root)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
STACK_FILE="${SCRIPT_DIR}/../docker-stack.yml"

if [[ ! -f "${STACK_FILE}" ]]; then
  error "docker-stack.yml not found at '${STACK_FILE}'."
  error "Clone the repo first and run this script from within it."
  exit 1
fi

# Collect environment variables needed by docker-stack.yml
echo ""
info "Collecting stack environment variables..."
read -rp "  Domain (e.g. procurement.example.com — leave blank for localhost): " DOMAIN
read -rp "  ACME email for Let's Encrypt (leave blank to skip TLS): " ACME_EMAIL
read -rp "  Keycloak realm [procurement]: " KEYCLOAK_REALM
read -rp "  Keycloak client ID [procurement-backend]: " KEYCLOAK_CLIENT_ID
read -rp "  MongoDB database name [procurement]: " MONGODB_DATABASE
read -rp "  Image tag to deploy [latest]: " IMAGE_TAG

# Apply defaults
DOMAIN="${DOMAIN:-localhost}"
ACME_EMAIL="${ACME_EMAIL:-admin@example.com}"
KEYCLOAK_REALM="${KEYCLOAK_REALM:-procurement}"
KEYCLOAK_CLIENT_ID="${KEYCLOAK_CLIENT_ID:-procurement-backend}"
MONGODB_DATABASE="${MONGODB_DATABASE:-procurement}"
IMAGE_TAG="${IMAGE_TAG:-latest}"

export DOMAIN ACME_EMAIL KEYCLOAK_REALM KEYCLOAK_CLIENT_ID MONGODB_DATABASE IMAGE_TAG
export REGISTRY="ghcr.io"
export IMAGE_NAME="tigredonorte/procurement"

docker stack deploy \
  --with-registry-auth \
  --compose-file "${STACK_FILE}" \
  procurement

echo ""
success "Stack 'procurement' deployed."
info "Check service status: docker stack services procurement"
info "Watch logs:           docker service logs -f procurement_backend"
echo ""

# ---------------------------------------------------------------------------
# Portainer webhook instructions
# ---------------------------------------------------------------------------
echo -e "${YELLOW}==========================================================${NC}"
echo -e "${YELLOW} NEXT STEP — Configure Portainer webhook for CI/CD${NC}"
echo -e "${YELLOW}==========================================================${NC}"
echo ""
if [[ "${DOMAIN}" != "localhost" ]]; then
  echo "  Portainer UI: https://portainer.${DOMAIN}"
else
  echo "  Portainer UI: http://$(hostname -I | awk '{print $1}'):9000"
  echo "  (Traefik is not routing to Portainer in localhost mode)"
fi
echo ""
echo "  1. Open the Portainer UI and complete the initial admin setup."
echo "  2. Navigate to: Stacks → procurement → Webhooks"
echo "  3. Enable the webhook and copy the generated URL."
echo "  4. Add it as a GitHub secret named 'PORTAINER_WEBHOOK_URL':"
echo "     https://github.com/tigredonorte/procurement/settings/secrets/actions"
echo ""
echo -e "${GREEN}Setup complete.${NC}"
