# Pi-Cluster

![pi cluster](https://raw.githubusercontent.com/tinoschroeter/k8s.homelab/master/docs/img/cluster01.jpg)

[![Kubernetes](https://img.shields.io/badge/Kubernetes-blue.svg)](https://github.com/kubernetes/kubernetes)
[![k3s](https://img.shields.io/badge/run%20on%20-Raspberry%20Pi-red)](https://github.com/tinoschroeter/k8s.homelab)

[![uptime](https://homelab.tino.sh/button/uptime)](https://github.com/tinoschroeter/k8s.homelab)
[![temp](https://homelab.tino.sh/button/tempe)](https://github.com/tinoschroeter/k8s.homelab)
[![cpu](https://img.shields.io/badge/CPU%20-16-orange)](https://github.com/tinoschroeter/k8s.homelab)
[![ram](https://img.shields.io/badge/RAM%20-20GB-orange)](https://github.com/tinoschroeter/k8s.homelab)
[![rx](https://homelab.tino.sh/button/netrx)](https://github.com/tinoschroeter/k8s.homelab)
[![tx](https://homelab.tino.sh/button/nettx)](https://github.com/tinoschroeter/k8s.homelab)
[![pods](https://homelab.tino.sh/button/pods)](https://github.com/tinoschroeter/k8s.homelab)
[![namespaces](https://homelab.tino.sh/button/ns)](https://github.com/tinoschroeter/k8s.homelab)

[![Build Status](https://jenkins.tino.sh/buildStatus/icon?job=k8s.homelab%2Fmaster)](https://jenkins.tino.sh/job/k8s./job/master/)
![](https://img.shields.io/github/last-commit/tinoschroeter/k8s.homelab.svg?style=flat)
[![GitHub Super-Linter](https://github.com/tinoschroeter/k8s.homelab/workflows/Lint%20Code%20Base/badge.svg)](https://github.com/tinoschroeter/k8s.homelab/actions/workflows/linter.yml)


## Table of contents

* [Parts](#Parts)
* [3D Print](#3D-Print)
* [PI Setup](#PI-Setup)
* [Kubernetes Setup](#Kubernetes-Setup)
* [Client Setup](#Client-Setup)
* [ingress](#ingress-nginx)
* [Cet-Manager](#Cet-Manager-letsencrypt)
* [Docker Registry](#Docker-Registry)
* [NFS Server](#NFS-Server)
* [logs](#logs)

## Parts

- 4 x Raspberry Pi 4 (4 and 8GB)
- 4 x SanDisk Extreme 64 GB microSDXC Memory Card
- 3 x SanDisk Ultra Fit USB 3.1 Flash-Laufwerk 256 GB
- 4 x GeeekPi Raspberry Pi 4 Luefter Kit, Aluminium Kuehlkoerper mit Luefter
- 4 x DeLock USB-Kabel - USB-C (M) bis 2 pin USB Header
- 1 x Hutschienen Netzteil 50W 5V 10A ; MeanWell, MDR-60-12
- 1 x Hutschiene / DIN-Schiene 30cm

## 3D Print

- [DIN Rail Stand KIT](https://www.thingiverse.com/thing:3609072)
- [Raspberry Pi DIN Rail Mount](https://www.thingiverse.com/thing:2659908)

## PI Setup

```shell
add cgroup_enable=memory to /boot/cmdline.txt

# configure timezone
dpkg-reconfigure tzdata
apt-get install ntp
```

## Kubernetes Setup

```shell
# master
curl -sfL https://get.k3s.io | K3S_KUBECONFIG_MODE="644" \
INSTALL_K3S_EXEC=" --disable=traefik" sh -

# find the node token
cat /var/lib/rancher/k3s/server/node-token

# find client config
cat /etc/rancher/k3s/k3s.yaml
```

```shell
# agent
k3s agent --server https://<ip master>:6443 --token ${mynodetoken}
```

## Client Setup

```shell
# copy client config from master
scp ubuntu@10.0.1.100:/etc/rancher/k3s/k3s.yaml ~/.kube/config

# replace master ip address
sed -i 's/127.0.0.1/10.0.1.100/' ~/.kube/config

# no pods on master node
kubectl taint node main-node01 kubernetes=master:NoSchedule
```

## ingress (nginx)

```shell
helm install nginx-ingress-extern ingress-nginx/ingress-nginx --namespace kube-system \
--set controller.ingressClass=nginx --set prometheus.create=true
```

## Cet-Manager (letsencrypt)

```shell
helm install cert-manager jetstack/cert-manager --namespace cert-manager --set installCRDs=true
```

```shell
cat letsencrypt-prod.yaml

apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    email: example@googlemail.com
    disableAccountKeyGeneration: false
    server: https://acme-v02.api.letsencrypt.org/directory
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx

kubectl apply -f letsencrypt-prod.yaml
```

## Docker Registry

```shell
kubectl create ns docker-registry
helm install docker-registry twuni/docker-registry -f values.yaml --namespace docker-registry

cat values.yaml
replicaCount: 1

image:
  repository: registry
  tag: 2.7.1
  pullPolicy: IfNotPresent
service:
  name: registry
  type: ClusterIP
  port: 5000
  annotations: {}
ingress:
  enabled: false
persistence:
  accessMode: 'ReadWriteOnce'
  enabled: true
  size: 10Gi
  storageClass: 'nfs-client'

storage: filesystem

secrets:
  htpasswd: "" # docker run --entrypoint htpasswd registry:2 -Bbn user password > ./htpasswd

configData:
  version: 0.1
  log:
    fields:
      service: registry
  storage:
    cache:
      blobdescriptor: inmemory
  data:
    body-size: "0"
  http:
    addr: :5000
    headers:
      X-Content-Type-Options: [nosniff]
  health:
    storagedriver:
      enabled: true
      interval: 10s
      threshold: 3

securityContext:
  enabled: true
  runAsUser: 1000
  fsGroup: 1000

cat ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/proxy-body-size: 600m
  name: registry-ingress
  namespace: docker-registry
spec:
  rules:
  - host: registry.example.com
    http:
      paths:
      - pathType: Prefix
        path: /
        backend:
          service:
            name: docker-registry
            port:
              number: 5000
  tls:
  - hosts:
    - registry.example.com
    secretName: registry-example-com-tls
```

```shell
# Every node in the cluster need this, to login to your docker registry

cat /etc/rancher/k3s/registries.yaml

mirrors:
  registry.tino.sh:
    endpoint:
      - "https://registry.example.com"
configs:
  "registry.tino.sh":
    auth:
      username: user # this is the registry username
      password: p@$$s0rd # this is the registry password
```

## NFS Server

```shell
# install NFS on 10.0.1.100 first and export /mnt/data
apt install nfs-kernel-server
cat /etc/exports
/mnt/data  10.0.1.0/24(rw,sync,no_subtree_check)

helm install nfs-subdir-external-provisioner --namespace nfs-subdir-external-provisioner --create-namespace \
nfs-subdir-external-provisioner/nfs-subdir-external-provisioner \
--set nfs.server=10.0.1.100 --set nfs.path=/mnt/data

cat pvc.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  namespace: nfs-subdir-external-provisioner
  name: example-pvc-data
spec:
  accessModes:
    - ReadWriteMany
  # - ReadWriteOnce
  storageClassName: nfs-client
  #storageClassName: local-path
  resources:
    requests:
      storage: 1Gi
```

## logs

```shell
# logs can be found in /var/log/containers on each host
```
