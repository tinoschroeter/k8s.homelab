# Pi-Cluster

<img src="https://raw.githubusercontent.com/tinoschroeter/k8s.homelab/master/docs/img/cluster01.jpg" align="center"
     alt="rain" width="800" height="488">
     
[![Kubernetes](https://img.shields.io/badge/Kubernetes-blue.svg)](https://github.com/kubernetes/kubernetes)
[![k3s](https://img.shields.io/badge/run%20on%20-Raspberry%20Pi-red)](https://github.com/tinoschroeter/k8s.homelab)
[![temp](https://homelab.tino.sh/button/tempe)](https://github.com/tinoschroeter/k8s.homelab)
[![cpu](https://img.shields.io/badge/CPU%20-16-orange)](https://github.com/tinoschroeter/k8s.homelab)
[![ram](https://img.shields.io/badge/RAM%20-20GB-orange)](https://github.com/tinoschroeter/k8s.homelab)
[![rx](https://homelab.tino.sh/button/netrx)](https://github.com/tinoschroeter/k8s.homelab)
[![tx](https://homelab.tino.sh/button/nettx)](https://github.com/tinoschroeter/k8s.homelab)
[![pods](https://homelab.tino.sh/button/pods)](https://github.com/tinoschroeter/k8s.homelab)
[![namespaces](https://homelab.tino.sh/button/ns)](https://github.com/tinoschroeter/k8s.homelab)


## Parts

 * 4 x Raspberry Pi 4 (4 and 8GB)
 * 4 x SanDisk Extreme 64 GB microSDXC Memory Card
 * 3 x SanDisk Ultra Fit USB 3.1 Flash-Laufwerk 256 GB
 * 4 x GeeekPi Raspberry Pi 4 Luefter Kit, Aluminium Kuehlkoerper mit Luefter
 * 4 x DeLock USB-Kabel - USB-C (M) bis 2 pin USB Header
 * 1 x Hutschienen Netzteil 50W 5V 10A ; MeanWell, MDR-60-12
 * 1 x Hutschiene / DIN-Schiene 30cm

## 3D Print

* [DIN Rail Stand KIT](https://www.thingiverse.com/thing:3609072)
* [Raspberry Pi DIN Rail Mount](https://www.thingiverse.com/thing:2659908)

## PI Setup

```
add cgroup_enable=memory to /boot/cmdline.txt

# configure timezone
dpkg-reconfigure tzdata
apt-get install ntp
```

## Kubernetes Setup

```
# master
curl -sfL https://get.k3s.io | K3S_KUBECONFIG_MODE="644" \
INSTALL_K3S_EXEC=" --disable=traefik" sh -

# find the node token
cat /var/lib/rancher/k3s/server/node-token

# find client config
cat /etc/rancher/k3s/k3s.yaml
```

```
# agent
k3s agent --server https://<ip master>:6443 --token ${mynodetoken}
```

## Client Setup

'''

'''
## ingress (nginx)

```
helm install nginx-ingress-extern ingress-nginx/ingress-nginx --namespace kube-system \
--set controller.ingressClass=nginx --set prometheus.create=true
```

## cetManager (letsencrypt)

```
helm install cert-manager jetstack/cert-manager --namespace cert-manager --set installCRDs=true
```

```
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

```
kubectl create ns docker-registry
helm install docker-registry twuni/docker-registry -f values.yaml --namespace docker-registry

....
```

## NFS Server

```
# install NFS on 10.0.1.100 first an export /mnt/data
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
