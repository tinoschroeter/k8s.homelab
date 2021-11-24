const fs = require("fs");
const temp = "/sys/class/thermal/thermal_zone0/temp";
const { makeBadge, ValidationError } = require("badge-maker");

const temperatur = () => {
  return (req, res) => {
    fs.readFile(temp, (err, data) => {
      if (!err) {
        const result = (data / 1000) || 0;
        const color = result > 77 ? "red" : "brightgreen"
        const svg = makeBadge({
          label: "CPU Temp ", // (Optional) Badge label
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

module.exports = temperatur;
