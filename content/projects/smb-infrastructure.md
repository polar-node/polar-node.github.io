+++
title = "SMB Infrastructure"
date = 2026-07-22
draft = false
status = "Completed"
categories = ["Projects", "Infrastructure", "SMBs"]
tags = ["linux", "opensource", "devops", "sysadmin", "proxmox", "ansible", "checkmk", "wazuh", "foss"]
description = "Practical infrastructure built for two small businesses under real-world constraints and near-zero budget: backups, monitoring, remote access, and security on repurposed hardware."
+++

### Overview

Two separate small-business engagements, both with essentially zero budget and no existing infrastructure. The first, paid partly in groceries, came first and proved the approach. It spurred the second: a mixed Windows/Linux environment for a second business, built on the same philosophy but with a wider scope.

### The problem

Neither business had any of the basics most infrastructure takes for granted: backups that actually restore, visibility into what's running, secure remote access, or any monitoring at all. Budget in both cases ruled out new hardware or commercial licensing.

### Architecture

**First engagement:** built on a repurposed 12-year-old HP EliteDesk 800 G1 desktop. Proxmox for virtualization, LXC containers per service, URBackup for bare-metal recovery, Tailscale for encrypted remote access, Prometheus and Grafana for monitoring, Wazuh for SIEM-level visibility, Ansible for day-2 operations.

**Second engagement:** a mixed Windows/Linux environment on spare hardware. CheckMK for monitoring, Ansible for automation, and an offsite immutable backup stack.

### Result

Both businesses went from zero infrastructure to backed-up, monitored, remotely-accessible systems, delivered entirely on hardware that was already on hand.

### Read the full story

- [I Got Paid in Groceries. Here's What I Built.](/posts/paid-in-groceries/) — the first engagement: backups, monitoring, remote access, and SIEM on a single repurposed desktop.
- [Necessity is the mother of invention](/posts/build-infra-zero-budget/) — the second: a mixed Windows/Linux environment, CheckMK, Ansible, and an offsite immutable backup stack.
