+++
title = "HA Apache Guacamole — Nginx + MariaDB Galera Cluster (IaC)"
date = 2026-06-19
draft = false
status = "in-progress"
categories = ["Guacamole", "High Availability", "IaC"]
tags = ["guacamole", "high-availability", "nginx", "mariadb", "galera", "load-balancing", "iac"]
description = "Infrastructure-as-Code deployment of a highly-available Apache Guacamole remote access gateway, load-balanced with Nginx and backed by a MariaDB Galera cluster."
+++

A resilient remote-access gateway built so that no single component — web tier, application tier, or database — is a single point of failure:

- **Multiple Guacamole nodes** behind an **Nginx** load balancer, so a node failure doesn't take down access
- **MariaDB Galera cluster** as the authentication/connection database backend — synchronous multi-master replication, no single DB instance to lose
- **Session recording** for connection auditing and compliance
- **Infrastructure as Code** — the whole stack defined and reproducible, not hand-built

The interesting part of this project isn't installing Guacamole — that's well documented. It's getting the **Galera cluster quorum right** (odd node count, proper arbitrator handling) and making sure failover at every layer — Nginx, Guacamole, and the database — actually works under a node failure, not just in theory.

More details, architecture diagram, and the repository link will follow as this gets built out.
