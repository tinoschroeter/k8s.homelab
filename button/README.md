```shell
# install memcached
kubectl create ns memcached
helm install mycache stable/memcached --set replicaCount=3
```
