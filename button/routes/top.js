const k8s = require("@kubernetes/client-node");  

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

k8s.topNodes(k8sApi).then((obj) => {
	console.log(obj)
	obj.forEach(item => {
		console.log("Memory: ")
		console.log(item.Memory.Capacity)
		console.log(item.Memory.RequestTotal)
		console.log("CPU: ")
		console.log(item.CPU.Capacity)
		console.log(item.CPU.RequestTotal)
	})
});
