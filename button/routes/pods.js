const k8s = require("@kubernetes/client-node");
const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

const pods = () => {
  return (req, res) => {
    k8sApi.listNamespacedPod("default").then((data) => {
      console.log(data.body);
      res.send("ok");
    });
  };
};

module.exports = pods
