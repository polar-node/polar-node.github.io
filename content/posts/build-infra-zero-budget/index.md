---
title: "Built It, and They Will Come"
date: 2026-08-07
draft: false
categories: ["projects", "Infrastructure"]
tags: ["linux", "opensource", "devops", "sysadmin", "proxmox", "ansible", "checkmk", "wazuh", "foss"]
description: "A second business, a mixed Windows/Linux environment, and a deliberate choice to leave the comfort zone: how CheckMK, Ansible, and an offsite immutable backup stack got built on spare hardware."
---

## Built it, and they will come

After posting my [earlier project](https://polar-node.work/posts/paid-in-groceries/), where I pulled a small, open-source infrastructure out of a hat for a small business that had nothing and now has real infrastructure, some people reached out and started asking questions. One of those turned into a hands-down agreement on a job.

### A tight budget and no Windows Domain

One of the people that approached me was a business owner with a SOHO running a bit "wild West-style". This business owner knows me personally and runs a local business with a lot of data and a very tight budget. They have Windows computers, but not enough to justify a Windows domain, and declined any suggestion of moving to SaaS on Azure. So I was forced, again, to work with what I had, and maybe get something more out of it.

They didn't have a proper backup strategy, and passwords were written on yellow sticky notes in the open. No alerts, no idea if anything was wrong, no centralization, no administration. Nobody knew if a computer had a failing SSD, or was throttling because it overheated. Everything simply worked, until it didn't, and everything was reactive.

### Choosing to be uncomfortable

So I decided to implement an open-source stack on a Proxmox host, installed on a spare, pretty decent HP EliteDesk machine.

I'm mostly a Zabbix guy, but the point was to be uncomfortable: learning comes from that. I chose CheckMK as the monitoring stack for two reasons: it has built-in graphs, dashboards, and discoverability, and I wanted to run it in production after dabbling with it in my homelab, to diversify my monitoring stack.

Pairing CheckMK with Ansible-driven deployment fit the constraint well. I wanted less time spent building graphs and dashboards, and better service discovery and alerting out of the box.

This job didn't feel any different from the previous one. The difference this time was a slightly better stack, and, I'll say it, a slightly better budget.

### The open-source stack

Proxmox host running an Ansible controller, Vaultwarden, Wazuh, CheckMK, Tailscale, and Proxmox Backup Server.

- **Ansible** handles orchestration on both Linux and Windows machines, including deploying to Windows over OpenSSH instead of relying on the clunkier WinRM.
- **Vaultwarden** replaces the sticky notes: an open-source, trustworthy password manager, self-hosted at no license cost.
- **Wazuh** because a SIEM doesn't have to cost a lot of money; security should be within reach at small-business scale.
- **Tailscale** because it works simply, without opening ports or leaving the firewall exposed.
- **Proxmox Backup Server** because it integrates natively with Proxmox, and backups are non-negotiable.

If any of these prove their value to the owner over time, the plan is to upgrade to a licensed or enterprise version where one makes sense, budget allowing.

On the NAS already in place, I added Snipe-IT for asset inventory, LubeLogger for fleet cost tracking, and AdGuard for network-wide ad and tracker filtering, all deployed as Docker containers, managed through Portainer.

Also deployed Ubuntu 26.04 LTS on another spare PC, kept off-site in a separate physical location, as the third copy in the 3-2-1 strategy. It's the offsite safeguard for all backups; nobody at the business even knows it exists. The host runs on Btrfs with Snapper, giving automatic rollback if an update breaks the system. For the data itself, it runs a ZFS pool with immutable snapshots as ransomware protection: even if everything else is compromised, that copy can't be altered or deleted. Reachable only via Tailscale, with access scoped through Tailscale ACLs and further restricted with UFW, no exposed ports. Cost: the hardware (already owned), my time and expertise, and electricity.

**Scope:** 10 Windows machines, 6 Linux containers, one Linux VM, and one remote Linux server.

Agent deployment automated via Ansible, same methodology carried over from the first project.

### Where I got tripped up

Adding new hosts in CheckMK (Community edition) was the biggest early challenge. It's easy to miss the "Accept" step, without which CheckMK won't start pulling metrics from a validated host or its discovered services.

### In practice

*[Service discovery / host inventory, blurred]*

*[Live dashboard, blurred]*

*[Ansible playbook snippet]*

*[Alert / notification example]*

### Why bother being uncomfortable

Nothing beats real experience and learning from small failures. Trying new things keeps my focus sharp: it consolidates core principles while honing new skills. I knew going in that the reward would be worth it: value added to the business, getting paid, and lessons learned from a new project.

### Does this count as real job experience?

Some will say this doesn't equate to a "real" job done in an office. But isn't a hardened, battle-tested, hands-on sysadmin exactly what everyone wants: someone who can implement, troubleshoot, document, and explain in a few words what, why  and how it all adds value to the business owner, without drowning them in technical detail?

If this isn't experience, I don't know what is.

### Next up

Now I'm taking an OpenTelemetry course from the Linux Foundation, another challenge, another step in growing my observability stack. My mantra: never stop learning, never stop growing.

And that doesn't mean I'm leaving Zabbix behind, quite the opposite. The more tools in my observability stack, the better. 
