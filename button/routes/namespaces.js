const { makeBadge, ValidationError } = require("badge-maker");
const k8s = require("@kubernetes/client-node");
const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

const namespaces = () => {
  return (req, res) => {
    try {
      k8sApi.listNamespace().then((obj) => {
        let howManyNamespaces = 0;
        howManyNamespaces = obj.body.items.length;
        console.log("Namespaces: ", howManyNamespaces);

        if (!howManyNamespaces) howManyNamespaces = "error";

        const svg = makeBadge({
          label: " ns ", // (Optional) Badge label
          message: howManyNamespaces.toString(), // (Required) Badge message
          labelColor: "#555", // (Optional) Label color
          color: "ligthgreen", // (Optional) Message color
          style: "flat", // (Optional) One of: 'plastic', 'flat',
          // 'flat-square', 'for-the-badge' or 'social'
        });
        res.setHeader("Content-Type", "image/svg+xml");
        return res.send(svg);
      });
    } catch (err) {
      res.send("error");
    }
  };
};

module.exports = namespaces;
