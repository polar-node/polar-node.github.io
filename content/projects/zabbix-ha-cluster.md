+++
title = "Zabbix HA Cluster — Proxies + Database Cluster (IaC)"
date = 2026-06-19
draft = false
status = "in-progress"
categories = ["Zabbix", "High Availability", "IaC"]
tags = ["zabbix", "high-availability", "proxies", "database-cluster", "terraform", "ansible", "proxmox", "aws", "azure", "gcp"]
description = "Infrastructure-as-Code deployment of a highly-available Zabbix monitoring cluster with distributed proxies and a clustered database backend, portable across on-premise and cloud."
+++

A fully redundant Zabbix monitoring stack, deployed entirely through code rather than manual configuration:

- **Multi-node Zabbix server cluster** — native Zabbix HA nodes for server-level failover
- **Distributed Zabbix proxies** — spread across network segments or regions for resilient, scalable data collection
- **Clustered database backend** — the catalog/history database itself deployed as a cluster, not a single point of failure
- **Infrastructure as Code** — the entire stack reproducible from a single set of Terraform/Ansible definitions

The goal is portability: the same IaC definitions should stand up the cluster identically whether the target is **on-premise Proxmox VE**, or a public cloud — **AWS**, **Azure**, or **GCP**. Same architecture, same automation, different provider underneath.

This is a deliberate next step from my existing [SNMP Discovery Template Creator](https://github.com/polar-node/snmp-discovery-template-creator) and [Zabbix Custom Items](https://github.com/polar-node/zabbix-custom-items) projects — moving from "configuring Zabbix well" to "running Zabbix as resilient infrastructure that doesn't go down when one node does."

More details, architecture diagram, and the repository link will follow as this gets built out.
