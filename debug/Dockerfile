FROM ubuntu:20.04

RUN apt-get update && \
  apt-get dist-upgrade -y && \ 
  apt-get install \ 
  dnsutils \
  traceroute \
  curl \
  vim \
  strace \
  htop -y 

CMD ["sleep", "3600"]
