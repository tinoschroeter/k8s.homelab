# Pi k8s Cluster install script

With this script, a Raspberry Pi Kubernetes host can be set up from scratch.

## How can I use this?

For bootstrapping, [zx](https://google.github.io/zx/) must be installed.

```bash
npm install -g zx
```

Run this script with **zx <https://raw.githubusercontent.com/tinoschroeter/k8s.homelab/refs/heads/master/pi_bootstrap.md>**

```js
echo`
1. main-node01
2. worker-node01
3. worker-node02
4. worker-node03
`;
const idx = await question("Wähle 1-4: ");
if (idx < 1 || idx > 4) {
  echo("choose between 1 and 4");
  process.exit(1);
}
```

First, we check whether the node has already been set up.

```js
const server = [
  "",
  "main-node01",
  "worker-node01",
  "worker-node02",
  "worker-node03",
];

await spinner("check if server is already installed...", async () => {
  const hostname = await $`ssh ubuntu@${server[idx]} "hostname -f"`;
  if (hostname.stdout.trim() == server[idx]) {
    echo("Server has already been set up...");
    process.exit(1);
  }
});
echo("Start Installation");
```

## Set Hostname

```js
await spinner("set hostname...", async () => {
  const setHostname = await $`ssh ubuntu@${server[idx]} bash << 'EOF'
echo "127.0.1.1 ${server[idx]}" | sudo tee -a /etc/hosts
EOF`;
});
```

## Date Time config

```js
await spinner("set date and time...", async () => {
  await $`ssh ubuntu@${server[idx]} bash << 'EOF'
sudo timedatectl set-timezone Europe/Berlin
sudo timedatectl set-ntp true
EOF`;
});
```

## Add ssh key

## System and Package Updates

```js
await spinner("system and package updates...", async () => {
  const install = await $`ssh ubuntu@${server[idx]} bash << 'EOF'
sudo apt-get update -y
sudo apt-get upgrade -y
sudo apt-get dist-upgrade -y
sudo apt-get --fix-broken install -y
sudo apt-get install net-tools vim htop dstat curl unattended-upgrades neofetch dnsutils git sysstat iotop python3-pip nfs-common -y
EOF`;
  echo(install.stdout);
});
```

## Disable password authentication

```js
await spinner("disable password authentication...", async () => {
  await $`ssh ubuntu@${server[idx]} bash << 'EOF'
sudo sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
EOF`;
});
```

## Set GPU memory split to minimum

```js
await spinner("check if server is already installed...", async () => {
  await $`ssh ubuntu@${server[idx]} "echo 'gpu_mem=16' | sudo tee -a /boot/firmware/config.txt"`;
});
```

## Disable WLAN and Bluetooth

```js
await spinner("disable WLAN and Bluetooth...", async () => {
  await $`ssh ubuntu@${server[idx]} bash << 'EOF'
echo 'dtoverlay=disable-wifi' | sudo tee -a /boot/firmware/config.txt
echo 'dtoverlay=disable-bt' | sudo tee -a /boot/firmware/config.txt
EOF`;
});
```

## Disable SWAP

```js
await spinner("disable Swap...", async () => {
  await $`ssh ubuntu@${server[idx]} bash << 'EOF'
sudo swapoff -a
EOF`;
});
```

## Enable cgroup

```js
await spinner("enable cgroup...", async () => {
  await $`ssh ubuntu@${server[idx]} "sudo sed '$ s/$/ cgroup_memory=1 cgroup_enable=memory/' -i /boot/firmware/cmdline.txt"`;
});
```

## Configure neofetch

```js
await spinner("configure neofetch...", async () => {
  await $`ssh ubuntu@${server[idx]} bash << 'EOF'
echo -e '#!/bin/sh\nneofetch | sudo tee /etc/motd' | sudo tee /etc/cron.hourly/motd.sh
sudo chmod +x /etc/cron.hourly/motd.sh
sudo neofetch | sudo tee /etc/motd
EOF`;
  echo("Installation completed");
});
```
