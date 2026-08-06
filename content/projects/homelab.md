---
title: "My Homelab"
date: 2026-08-06
draft: false
status: "Running"
categories: ["Infrastructure", "Homelab"]
tags: ["hardware", "proxmox", truenas",  "opnsense",  "networking", "homelab-hardware"]
description: "The inner workings of a homelab, the journey building it, and lessons learned."
---

### Overview

I'm a firm believer in experience gained by breaking things, working through failures, and solving problems under real constraints, with real ownership of the decisions.

The homelab idea was introduced to me by r/homelab and a few other forums, including Tom Lawrence's, a very technical community.

For context: my current setup is a rework of a previous build. Below I'll detail the actual hardware choices, the struggles along the way, and the real-world constraints behind them.

The homelab isn't static. I'm always iterating on power consumption, physical footprint, efficiency, and performance.

### Hardware

**Router:** Lenovo M720q with a quad-port Intel NIC, running OPNsense. Upgraded from an HP T620 running pfSense

**NAS:** Synology DS220+, upgraded to 20 GB DDR4, with 2x 6 TB Toshiba HDDs. A capacity upgrade is on hold for now, I simply can't justify the cost with current drive prices.

**Main server** (custom build):

- **Case:** Jonsbo N4, with a custom 3D-printed front intake for two extra fans, improving airflow and cooling for the HDD bay
- **CPU:** Ryzen 5 5660 PRO APU (6C/12T). Specifically chose the PRO variant for ECC support
- **Cooler:** Noctua NH-L9x65
- **Motherboard:** ASRock B550 Pro4, known and proven to work with unbuffered ECC RAM
- **RAM:** 2x 32 GB DDR4
- **Boot/OS drive:** Crucial MX500 250 GB, running Proxmox VE
- **PVE storage:** 1.8 TB Kioxia Exceria Plus G2 SSD
- **TrueNAS OS drive:** WD SN730 1 TB, passed through to the TrueNAS VM
- **TrueNAS storage:** 4x 4 TB Toshiba N300 HDDs, passed through to the TrueNAS VM
- **PSU:** Seasonic Gold 550W, roughly 50W idle draw
- **NICs:** Intel I225-V (vmbr0) and Intel I226-V (dedicated backup NIC, vmbr1). Both added after disabling the onboard Realtek chip, which proved unreliable on Proxmox and isn't worth the risk in a real testing environment
- **HBA:** LSI SAS2008, passed through to the TrueNAS VM
- **Zigbee:** Sonoff USB MG24 controller, passed through to Home Assistant

In [this post](https://polar-node.work/posts/building-homelab-server/), i explain all hardware choice and how it all came togheter.

### Virtualization & Orchestration

Proxmox is the hypervisor, close to the default choice for a homelab. I may pick up some hardware down the line to experiment with XCP-ng, but for now it's Proxmox all the way.

VM/LXC templates are built with my own published template-creation script.

### Networking

| VLAN | Name | Subnet | Purpose |
|------|------|--------|---------|
| 10 | MGMT | 192.168.11.0/24 | Proxmox host, DS220+ DSM, OPNsense management, last segment to migrate |
| 21 | SERVERS | 192.168.21.0/24 | All LXCs and service VMs |
| 30 | STORAGE | 192.168.30.0/24 | TrueNAS VM, PBS |
| 40 | IOT | 192.168.40.0/24 | Home Assistant, Zigbee devices |
| 50 | MEDIA | 192.168.50.0/24 | Jellyfin, Heimdall, Portainer, Unifi |
| 60 | VPNWIFI | 192.168.60.0/24 | Guest Wi-Fi, forced through WireGuard |
| 100 | GUEST | — | Pre-existing, reused |

### Storage & Backups

The DS220+ NAS runs constantly and, now upgraded to 20 GB RAM, hosts a VM running Proxmox Backup Server. Its storage pool is a slice of the NAS's RAID1 volume, and it backs up all Proxmox LXCs and VMs.

The TrueNAS VM also mirrors its ZFS pool, over Tailscale, to a remote HP ProLiant MicroServer G8 running TrueNAS Scale, the offsite third copy. Adding S3 storage on Scaleway to the backup chain is on the backlog.

### Monitoring & Observability

I started with Zabbix in the homelab, broke it, and relearned it more than once. On a recent job, I deployed it in real infrastructure and cut incident response time from hours or days down to minutes, that result only sharpened my interest further. CheckMK was next, already deployed on a client project after some homelab dabbling. Up next: OpenTelemetry, Netdata, and Datadog.

### Services Running

Most LXCs below also run `node_exporter` for Prometheus scraping; that's omitted from individual rows to keep the tables short.

**Proxmox Host (zeus)**

| Service | Solves |
|---|---|
| Proxmox VE | Hypervisor: VM/LXC management, hardware isolation, snapshots, backup integration |
| QEMU Guest Agent | Clean shutdown, IP reporting, filesystem freeze during snapshots |
| NUT client (upsmon) | Graceful shutdown of all VMs/LXCs then host, triggered by UPS events via the DS220+ NUT server |

**TrueNAS VM**

| Service | Solves |
|---|---|
| TrueNAS SCALE | ZFS pool management, datasets, NFS/SMB shares, snapshots, replication |
| ZFS | Data integrity via checksums, copy-on-write, compression, deduplication, snapshots |
| Replication task | Receives incremental ZFS snapshots from the DS220+ over the dedicated storage network |
| ZFS send | Sends incremental snapshots offsite to the remote TrueNAS box via Tailscale |

**hestia — Home Assistant VM** 

| Service | Solves |
|---|---|
| Home Assistant OS | IoT control, automations, dashboards, Zigbee coordinator via USB passthrough |
| Zigbee coordinator | Local Zigbee mesh, no cloud dependency |

**phpIPAM VM** 

| Service | Solves |
|---|---|
| phpIPAM | IP address management, subnet tracking, network discovery, host inventory |
| Nginx + PHP 8.4 + MariaDB | Serves and runs the phpIPAM app and stores its data |
| fping / nmap | Host and port discovery for subnet scanning |

**forge — CI/CD VM** 

| Service | Solves |
|---|---|
| Docker Engine | Runs job containers for Gitea Actions |
| Gitea Actions runner | Picks up and executes CI jobs from Cadmus (Gitea), in isolated containers |

**argus — Zabbix LXC** 

| Service | Solves |
|---|---|
| Zabbix Server | Infrastructure monitoring, alerting, thresholds, SNMP polling |
| Nginx + PHP 8.4 + MariaDB | Serves and runs the Zabbix web UI and stores history/config |

**cadmus — Gitea LXC** 

| Service | Solves |
|---|---|
| Gitea | Self-hosted Git: source control, PRs, issues, wikis |
| Gitea Actions | GitHub Actions-compatible CI/CD engine |
| Container Registry | Stores Docker images built by CI pipelines |

**bookstack**

| Service | Solves |
|---|---|
| BookStack | Wiki/documentation platform, organized as Books/Chapters/Pages |

**NPM — Nginx Proxy Manager LXC** 

| Service | Solves |
|---|---|
| Nginx Proxy Manager | Reverse proxy, SSL termination, cert automation via DuckDNS DNS-01 |
| Certbot | Requests and renews Let's Encrypt wildcard certs |

**Tailscale LXC** 

| Service | Solves |
|---|---|
| Tailscale | WireGuard mesh VPN, exit node, tunnel for offsite ZFS replication |

**step-ca LXC** 

| Service | Solves |
|---|---|
| Smallstep CA | Issues TLS certs for internal `.gallactic.lan` hostnames that public CAs can't validate |
| ACME endpoint | Automated cert requests, same protocol as Let's Encrypt |

**kronos LXC** 

| Service | Solves |
|---|---|
| Prometheus | Scrapes all hosts via node_exporter every 5s, stores time series data |
| Grafana | Dashboards across all scraped metrics (Node Exporter Full, ID 1860) |

**daedalus LXC** 

| Service | Solves |
|---|---|
| Ansible | Orquestration, configuration management, playbook provisioning |
| srv_ansible user | Dedicated unprivileged user, SSH key auth, passwordless sudo across all hosts |

**DS220+ — olympus** 

| Service | Solves |
|---|---|
| Synology DSM 7 | Storage management, Docker/VM host, auto power-on after outage |
| PBS VM | Proxmox Backup Server, receives and deduplicates all Proxmox backups |
| NUT server (bsnmpd) | Monitors the CyberPower UPS over USB, exposes state to NUT clients |
| Heimdall | Dashboard linking to all internal services |
| Portainer | Docker container management, webhook endpoints for CI/CD |
| Unifi Controller | Manages the Ubiquiti AC-Lite AP, SSIDs, client visibility |
| Jellyfin | Local media streaming |

**OPNsense — starship** 

| Service | Solves |
|---|---|
| OPNsense | Routing, NAT, firewall rules, inter-VLAN routing, WAN gateway |
| Unbound DNS | Local resolution, host overrides for `.gallactic.lan` |
| DHCP server | Per-VLAN IP assignment |
| bsnmpd | SNMP metrics exposed to Zabbix |
| NUT client (upsmon) | Graceful shutdown on UPS power event |
| VLAN interfaces | MGMT / SERVERS / STORAGE / IOT / MEDIA / VPNWIFI, six segments in progress |

**Local AI Stack** (on Proxmox)

| Service | Solves |
|---|---|
| Ollama | Local inference for open-weight LLMs (Llama, Mistral, etc.), no data leaves the network |
| Open WebUI | OpenAI-compatible chat interface for local Ollama models |

**Planned / Not Yet Deployed**

| Service | Target | Solves |
|---|---|---|
| Authelia | DS220+ (Docker) | SSO and MFA in front of all NPM-proxied services |
| Semaphore | daedalus | Web UI for Ansible playbook management and scheduling |
| Loki | kronos | Log aggregation into Grafana |
| Ntfy / Gotify | TBD | Push notifications for Grafana alerts and Zabbix triggers |
| WireGuard | VPS | VPN gateway for VPNWIFI VLAN traffic |

