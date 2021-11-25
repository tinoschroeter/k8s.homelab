const k8s = require("@kubernetes/client-node");
const request = require("request");

const kc = new k8s.KubeConfig();
kc.applyToRequest({});

const domains = () => {
  return (req, res) => {
    request.get(
      `${
        kc.getCurrentCluster().server
      }/apis/networking.k8s.io/v1beta1/ingresses`,
      opts,
      (error, response, body) => {
        if (error) {
          console.log(`error: ${error}`);
          return res.status(500);
        }
        if (response) {
          console.log(`statusCode: ${response.statusCode}`);
          if (response.statusCode !== 200) {
            console.log("no connection...");
          }
          const json = JSON.parse(body);
          res.send(json);
        }
      }
    );
  };
};

module.exports = domains;
