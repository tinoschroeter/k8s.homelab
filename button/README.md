kubectl create ns memcached
helm install mycache stable/memcached --set replicaCount=3
