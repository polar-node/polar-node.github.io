---
title: "Automating Proxmox VM Template Creation with Cloud-Init"
date: 2026-06-15
draft: false
categories: ["Proxmox", "Automation"]
tags: ["proxmox", "cloud-init", "bash", "virtualization", "iac"]
description: "How I built a Bash script to automate cloud-init template creation for 11 Linux distributions on Proxmox VE."
---

## The problem

There's something innate in some people — the drive to fix whatever is annoying. Annoying to some, but apparently default behavior for others.

Since I started my journey with Proxmox, I was amazed by its capabilities, and every release improved on that foundation. But there was trouble in this newfound paradise: one of the most repetitive tasks was creating a VM almost identical to the previous one. Same base OS, same baseline packages, same manual clicking through the same wizard.

Me being me, I knew those days were over. I needed a template — something streamlined that already had the utilities I always ended up installing manually after spinning up a new VM.

## The solution

So there I was on the Proxmox forums, asking about this. It wasn't like the Arch forums, where "RTFM" is the unofficial motto — people pointed me toward the documentation and a few posts that explained, in detail, what needed to be done.

After reading and understanding the core concepts, cloud-init felt like a light at the end of the tunnel. I ran the documented commands by hand, found a few blogs from sysadmins who'd written small scripts to semi-automate the process, and realized I was almost there myself.

I'm not a coder by trade — I'm more of a hardware/systems administration person. But I like to cook. And writing this script turned out to be a lot like building a new recipe: gather the right ingredients (packages, configs), follow a process in the right order, and taste-test along the way until it actually works.

## How it works

The script doesn't reinvent the wheel — it wraps Proxmox's own `qm` commands and the cloud-init workflow that's already well documented on the Proxmox wiki, and turns a 20-step manual process into a single guided run.

It walks through nine phases:

1. **Prerequisites** — checks for `libguestfs-tools`, installs it if missing.
2. **Distribution selection** — pick from 11 supported images: Debian 12/13, Ubuntu 22.04/24.04/26.04, Rocky 9/10, AlmaLinux 8/9, Fedora 44, and openSUSE Leap 15.6.
3. **Image handling** — download the official cloud image, or point it at a local one you already have.
4. **Storage detection** — auto-detects every Proxmox storage backend and lets you pick.
5. **VM configuration** — ID, name, CPU, RAM, disk size, network (DHCP or static, with DNS and search domain), optional extra NICs.
6. **Software configuration** — choose Minimal, Standard, or Custom package profiles; optional Ansible-ready packages; optional SSH key injection; timezone; serial console.
7. **Summary & confirmation** — a full printout of every choice before anything actually runs.
8. **Preflight checks** — verifies CPU, RAM, and disk space are actually available, and that the VM ID isn't already taken, before touching anything.
9. **Execution & post-creation** — installs packages into the image, creates and configures the VM, converts it to a template, tags it, and cleans up.

A typical run looks like this:

```bash
sudo ./proxmox-template-creator-v2.2.sh

==============================================
  Proxmox Cloud-Init Template Creator v2.2
==============================================

[STEP] Select Linux Distribution
----------------------------------------
0) Debian 12 (Bookworm)
1) Debian 13 (Trixie)
2) Ubuntu 22.04 LTS (Jammy)
...
10) OpenSUSE Leap 15.6
----------------------------------------
Select distribution [0-10]: 3

[OK] Selected: Ubuntu 24.04 LTS (cloud-init user: ubuntu)
```

From there it just asks the right questions in the right order — storage, sizing, networking, packages — and at the end you have a ready-to-clone template instead of a half-remembered checklist.

The preflight phase was the part I cared about most. Nothing is more frustrating than watching a script download a multi-gigabyte cloud image, spend ten minutes injecting packages, and *then* fail because the VM ID you picked was already taken. Now it checks that upfront, and if the ID's in use, it just asks for another one instead of dying halfway through.

It's not glamorous work. But it turned a repetitive, error-prone task into something I run once and trust.

## Why I made it public

I learned almost everything about cloud-init and the `qm` workflow from other people's forum posts, blogs, and half-finished scripts shared for free. None of this would exist without that. So once the script actually worked reliably, the obvious next step was to put it on GitHub — not because it's revolutionary, but because someone else stuck on the same repetitive task deserves the same shortcut I was looking for. It's the least I can do to give back to a community that gave me the answer first.

There's also a bigger idea behind this, one borrowed from Toyota's manufacturing philosophy: **Kaizen** — continuous improvement, often starting from the smallest, most annoying inefficiency on the floor. Toyota didn't build its reputation by solving one giant problem. It built it by noticing the small, repeated frictions in a process and removing them, one at a time, relentlessly.

That's really what this script is. It's not infrastructure-as-code at enterprise scale. It's just someone noticing a small annoyance — clicking through the same VM wizard for the tenth time — and refusing to accept it as normal. That instinct, multiplied across a career, is what separates people who maintain systems from people who improve them. It's not a single impressive project that tells that story — it's the pattern underneath it: treating friction as a problem worth solving, every time, even when no one's asking you to.

The repo is public, documented, and open for anyone running Proxmox to use, fork, or improve further:

**[github.com/polar-node/proxmox-template-creator](https://github.com/polar-node/proxmox-template-creator)**