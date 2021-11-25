const { makeBadge, ValidationError } = require("badge-maker");
const k8s = require("@kubernetes/client-node");
const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

const pods = () => {
  return (req, res) => {
    k8sApi.listPodForAllNamespaces().then((obj) => {
      let howManyPods = 0;
      try {
        howManyPods = obj.body.items.filter(
          (item) => item.status.phase === "Running"
        ).length;
        console.log("Pods count: ", howManyPods);
      } catch (err) {
        console.error(err);
      }

      if (!howManyPods) howManyPods = "error";

      const svg = makeBadge({
        label: " Pods ", // (Optional) Badge label
        message: howManyPods.toString(), // (Required) Badge message
        labelColor: "#555", // (Optional) Label color
        color: "ligthgreen", // (Optional) Message color
        style: "flat", // (Optional) One of: 'plastic', 'flat',
        // 'flat-square', 'for-the-badge' or 'social'
      });
      res.setHeader("Content-Type", "image/svg+xml");
      return res.send(svg);
    });
  };
};

module.exports = pods;
