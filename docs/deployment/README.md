# Procurement — Docker Swarm + Portainer Deployment

This document covers everything you need to deploy the Procurement monorepo to a DigitalOcean Droplet (or any Ubuntu host) using Docker Swarm, Portainer, and Traefik.

---

## Architecture Overview

```
Internet
    │
    ▼
 Traefik (80/443)          ← reverse proxy + TLS via Let's Encrypt
    │
    ├──► Frontend (:80)
    ├──► Backend  (:4000)   /api prefix
    ├──► Keycloak (:8080)   auth.<DOMAIN>
    └──► Portainer (:9000)  portainer.<DOMAIN>

Backend / Worker
    ├──► MongoDB  (internal network only)
    └──► Redis    (internal network only)
```

All application images are built and pushed by CI to `ghcr.io/tigredonorte/procurement/{app}:{tag}`.

Deployment is triggered automatically when a push lands on `main` or a `v*.*.*` tag is created: the CD workflow calls the Portainer webhook, which instructs Swarm to pull the updated images and perform a rolling update.

---

## Prerequisites

### DigitalOcean Droplet

| Attribute | Minimum          | Recommended      |
| --------- | ---------------- | ---------------- |
| OS        | Ubuntu 22.04 LTS | Ubuntu 24.04 LTS |
| RAM       | 2 GB             | 4 GB             |
| vCPU      | 1                | 2                |
| Disk      | 25 GB            | 50 GB            |
| Region    | Any              | Closest to users |

A domain name with an A record pointing to the Droplet IP is required for HTTPS (Let's Encrypt).

### Local machine

- Git
- `ssh` client

---

## One-Time Server Setup

### 1. SSH into the Droplet

```bash
ssh root@<DROPLET_IP>
```

### 2. Clone the repository

```bash
git clone https://github.com/tigredonorte/procurement.git /opt/procurement
cd /opt/procurement
```

### 3. Run the bootstrap script

```bash
sudo bash scripts/setup-swarm.sh
```

The script will:

1. Install Docker Engine
2. Initialise a single-node Docker Swarm
3. Create the `proxy` and `internal` overlay networks
4. Prompt for Docker secrets (MongoDB credentials, Keycloak credentials)
5. Log in to `ghcr.io`
6. Prompt for environment variables (domain, image tag, etc.)
7. Deploy the initial stack with `docker stack deploy`
8. Print instructions for configuring the Portainer webhook

The entire process takes roughly 5 minutes.

---

## Accessing Portainer

After the stack is deployed, Portainer is available at:

- **With a domain:** `https://portainer.<YOUR_DOMAIN>`
- **Without a domain (localhost/IP):** `http://<DROPLET_IP>:9000`

On first visit, Portainer will ask you to create an admin account. Do this immediately — Portainer disables the setup screen after a short timeout.

---

## Setting GitHub Secrets

These secrets are required for CD to work:

| Secret name             | Where to get it                                              |
| ----------------------- | ------------------------------------------------------------ |
| `PORTAINER_WEBHOOK_URL` | Portainer UI: **Stacks → procurement → Webhooks → copy URL** |

Add secrets at:
`https://github.com/tigredonorte/procurement/settings/secrets/actions`

### Optional secrets (kept for reference, no longer used by CD)

The old SSH-based deploy required `DEPLOY_HOST`, `DEPLOY_USER`, and `DEPLOY_SSH_KEY`. These can be removed once the webhook approach is confirmed working.

---

## How Automatic Deploys Work

```
git push origin main
        │
        ▼
 CI workflow (ci.yml)
  lint → typecheck → build → test
        │
        ▼
 CD workflow (cd.yml)
  build-and-push matrix (frontend, backend, worker)
    → push ghcr.io/tigredonorte/procurement/{app}:latest + sha-*
        │
        ▼
 deploy job
    → POST $PORTAINER_WEBHOOK_URL
        │
        ▼
 Portainer triggers:
    docker stack deploy -c docker-stack.yml procurement
        │
        ▼
 Swarm performs rolling update (start-first order)
```

The Portainer webhook is a single `curl -X POST` with no body. Portainer re-reads the stack file stored in its database (which was seeded from `docker-stack.yml` on first deploy) and re-pulls images that have changed tags.

---

## Triggering a Manual Deploy

### Via Portainer UI

1. Go to **Stacks → procurement**
2. Click **Update the stack**
3. Optionally change the `IMAGE_TAG` environment variable
4. Click **Update**

### Via GitHub Actions UI

1. Go to **Actions → CD**
2. Click **Run workflow** (only works on `main` or a tag)

### Via the command line on the Droplet

```bash
cd /opt/procurement
export IMAGE_TAG=v1.2.3   # or latest
docker stack deploy --with-registry-auth -c docker-stack.yml procurement
```

---

## Managing Docker Secrets

Secrets are immutable in Docker Swarm. To rotate a secret:

```bash
# 1. Create a new version of the secret
printf 'new-password' | docker secret create procurement_mongodb_password_v2 -

# 2. Update docker-stack.yml to reference the new secret name
# 3. Redeploy the stack
docker stack deploy --with-registry-auth -c docker-stack.yml procurement

# 4. Remove the old secret once no service references it
docker secret rm procurement_mongodb_password
```

### List all secrets

```bash
docker secret ls
```

---

## Viewing Logs

### All services

```bash
docker stack services procurement
```

### Specific service (streaming)

```bash
docker service logs -f procurement_backend
docker service logs -f procurement_worker
docker service logs -f procurement_frontend
docker service logs -f procurement_mongodb
```

### Via Portainer UI

Go to **Stacks → procurement → service name → Logs**

---

## Scaling Services

### Scale backend to 3 replicas

```bash
docker service scale procurement_backend=3
```

Note: MongoDB and Redis are intentionally kept at 1 replica. MongoDB cannot be horizontally scaled without a replica set configuration; Redis would need Sentinel or Cluster mode.

### Persistent scale change

Update the `replicas:` value in `docker-stack.yml` and redeploy:

```bash
docker stack deploy --with-registry-auth -c docker-stack.yml procurement
```

---

## Rolling Back a Bad Deploy

### Via Portainer UI

1. Go to **Stacks → procurement**
2. Click **Rollback**

### Via CLI

```bash
docker service rollback procurement_backend
docker service rollback procurement_worker
docker service rollback procurement_frontend
```

This returns each service to the previous image version stored in Swarm's task history.

---

## Firewall Recommendations

Allow only these ports on the Droplet:

| Port | Protocol | Purpose                               |
| ---- | -------- | ------------------------------------- |
| 22   | TCP      | SSH (consider restricting to your IP) |
| 80   | TCP      | HTTP (Traefik redirects to HTTPS)     |
| 443  | TCP      | HTTPS                                 |

All other ports (4000, 6379, 27017, 8080, 9000) should be blocked at the firewall level. Portainer and Keycloak are accessible only through Traefik at their subdomain routes.

```bash
# DigitalOcean firewall via doctl, or configure in the web console
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

---

## Troubleshooting

### Service stuck in "pending" state

```bash
docker service ps --no-trunc procurement_backend
```

Common causes:

- Image not found — check that ghcr.io login is still valid and the image was pushed
- Insufficient memory — check `free -h` on the Droplet
- Secret missing — verify `docker secret ls` lists all required secrets

### Re-authenticate with ghcr.io

```bash
echo "<PAT>" | docker login ghcr.io -u <github-username> --password-stdin
```

Then redeploy with `--with-registry-auth` to propagate the credentials to worker nodes.

### Check Traefik routing

```bash
docker service logs -f procurement_traefik
```

Visit `http://<DROPLET_IP>:8081` (Traefik dashboard, localhost only) via an SSH tunnel:

```bash
ssh -L 8081:localhost:8081 root@<DROPLET_IP>
# then open http://localhost:8081 in your browser
```
