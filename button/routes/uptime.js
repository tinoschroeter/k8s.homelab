const fs = require("fs");
const temp = "/proc/uptime";
const { makeBadge, ValidationError } = require("badge-maker");

const uptime = () => {
  return (req, res) => {
    fs.readFile(temp, (err, data) => {
      if (!err) {
        const result = Math.floor(data / 60 / 60 / 24);
        const color = result > 182 ? "red" : "brightgreen"
        const svg = makeBadge({
          label: "Uptime ", // (Optional) Badge label
          message: ` ${result.toString()} C`, // (Required) Badge message
          labelColor: "#555", // (Optional) Label color
          color, // (Optional) Message color
          style: "flat", // (Optional) One of: 'plastic', 'flat', 
                         // 'flat-square', 'for-the-badge' or 'social'
        });
        res.setHeader('Content-Type', 'image/svg+xml');
        return res.send(svg);
      }
      res.json(err);
    });
  };
};

module.exports = uptime;
