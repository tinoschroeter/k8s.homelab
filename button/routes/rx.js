const fs = require("fs");
const value = "/sys/class/net/eth0/statistics/rx_bytes";
const { makeBadge, ValidationError } = require("badge-maker");

const rx = () => {
  return (req, res) => {
    fs.readFile(value, (err, data) => {
      if (!err) {
        const result = data / Math.pow(10, 9).toFixed(2);
        const svg = makeBadge({
          label: ` RX `, // (Optional) Badge label
          message: ` ${result.toString()} GB`, // (Required) Badge message
          labelColor: "#555", // (Optional) Label color
          color: "ligthgreen", // (Optional) Message color
          style: "flat", // (Optional) One of: 'plastic', 'flat',
          // 'flat-square', 'for-the-badge' or 'social'
        });
        res.setHeader("Content-Type", "image/svg+xml");
        return res.send(svg);
      }
      res.json(err);
    });
  };
};

module.exports = rx;
