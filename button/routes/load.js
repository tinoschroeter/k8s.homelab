const fs = require("fs");
const loadavg = "/proc/loadavg";
const { makeBadge, ValidationError } = require("badge-maker");

const cpuCount = 4;

const load = () => {
  return (req, res) => {
    fs.readFile(loadavg, "utf8", (err, data) => {
      if (!err) {
        const result = Math.floor((data.split(" ")[0] / cpuCount) * 100);
        const color =
          result > 80 ? "red" : result > 50 ? "yellow" : "brightgreen";

        const svg = makeBadge({
          label: "CPU ", // (Optional) Badge label
          message: `${result.toString()} %`, // (Required) Badge message
          labelColor: "#555", // (Optional) Label color
          color, // (Optional) Message color
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

module.exports = load;
