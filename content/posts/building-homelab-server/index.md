---
title: "Building the Homelab Server: Hardware Choices and Why"
date: 2026-08-06
draft: false
status: "Running"
categories: ["Infrastructure", "Homelab"]
tags: ["hardware", "homelab-hardware"]
description: "In this post I go through every decision regarding hardware choice, power consumption, and the overall build."
---

As I said, the homelab project isn't static. However, this is the current hardware snapshot, if you will.

**Main server (custom build):**

- **Case:** Jonsbo N4, with a custom 3D-printed front intake for two extra fans, improving airflow and cooling for the HDD bay
- **CPU:** Ryzen 5 5650G PRO APU (6C/12T). Specifically chose the PRO variant for ECC support
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

Now I want to explain the rationale behind each hardware choice, so I decided to make this its own post. The main homelab writeup would get too large otherwise, and it's easy to lose focus along the way.

Since this is my digital testing lab, I wanted something running 24/7, but that's easier said than done given rising energy costs.

So my main server had to tick these boxes:

1. Frugal with power consumption
2. ECC RAM, to run TrueNAS at something closer to enterprise level
3. Not cost a fortune, ideally prosumer or consumer hardware that's easy to replace
4. Noise at a minimum, since a server running 24/7 shouldn't disturb everyone in the house

### One: Power Consumption

For homelabbers, power consumption is what makes or breaks a 24/7 setup, because it creeps and eventually shows up in your monthly bill. After digging through forums and videos, one resource stood out: a list of CPU/motherboard combos rated and verified for power draw, from one of Wolfgang's videos. I went looking for exactly those combos.

Little did I know the "Wolfgang effect" is real. Every combo on that list had either doubled or tripled in price, or was simply out of stock everywhere. It turned into mission impossible for a while. I eventually landed on the Ryzen 5 5650G PRO and ASRock B550 Pro4. This chip draws less power and offers better performance for that power envelope.

After building the server, I ran [AutoASPM](https://github.com/notthebee/AutoASPM) to push power consumption down further, and it genuinely helped.

A reliable PSU mattered too, I always buy the best one I can afford. Went with the Seasonic Gold 550W SFX for its efficiency rating.

### To ECC or Not to ECC

Every homelab owner has this conundrum at least once, and reads endless forum threads debating ECC RAM. I wanted to try it, and it was a partial success.

Here's the story: I bought a specific Kingston module, the KSM32ED8/32HC (32 GB, 3200 CL22, 288-pin), tested it, and it worked, both TrueNAS and Memtest Pro confirmed ECC was active. But the seller only had one stick, and before I could source a second, the AI-driven RAM price surge hit, and affordable ECC RAM stopped being an option for me.

### Costs: TCO Dictates Everything

It's not easy to justify spending money on homelab hardware, sometimes it's simply easier to spin up a cloud account and move on. Not for me, I wanted a physical server and full ownership of the hardware.

To cut costs, I bought a used Noctua cooler and saved 25 euros. Doesn't sound like much, but every euro counts. Parts were also bought over a long stretch of time, so I could set price alerts and hunt for the best deals. In the end, patience and persistence paid off with some genuinely good deals.

### Noise, or the Lack of It

Between the Noctua cooler, a Noctua 14cm fan, and Arctic Slim intake fans, everything was tuned to keep the server quiet. The Seasonic PSU also has a feature that keeps the fan off until power draw crosses a certain threshold, so overall I'm satisfied with the noise level.

And it wasn't just me who had to be satisfied, the server also had to pass the Wife Acceptance Test. Laugh all you want, there's no way around that one.

### NAS Server Case

This was by far the hardest decision, since it had to be chosen alongside the motherboard, while also being compact but not cramped, sturdy but not expensive, with good interior layout, airflow, and cable management.

I won't pretend the Jonsbo N4 ticks every box, but it comes closer than most. Remember, I was on a budget, and managed to score a very good deal on the case, brand new.

On Reddit, some users reported buyer's remorse, citing weak cable management and lacking front airflow. My fix was a custom 3D-printed bracket to fit two additional Arctic Slim fans, which improved airflow considerably. The bracket and fans cost around 40 euros, which pushed the whole case choice slightly over budget.

### TrueNAS

This is where some hardware decisions trace back to. I wanted a TrueNAS server but didn't want two physical machines, for space and cost reasons.

So how do you run TrueNAS while still being able to migrate the OS or the pool if the hardware dies?

The solution turned out to be simple: Proxmox supports passthrough, so the TrueNAS VM has its OS drive and HBA passed through directly. That means the NVMe OS drive and HBA card, along with the ZFS pool, can be moved to another motherboard with minimal fuss.

### Home Assistant

I also wanted a dedicated VM running Home Assistant, and used the same approach: the Sonoff MG24 USB and a TP-Link Bluetooth adapter are passed through directly to the HA VM. Everything works, and there's real satisfaction in running something this stable and predictable. 
