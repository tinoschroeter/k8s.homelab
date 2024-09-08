const fs = require("fs");
const meminfo = "/proc/meminfo";
const { makeBadge } = require("badge-maker");

const mem = () => {
  return (req, res) => {
    fs.readFile(meminfo, "utf8", (err, data) => {
      const list = data.split("\n");
      const memTotal = list[0].split(":")[1].replace(" kB", "");
      const memAvailable = list[2].split(":")[1].replace(" kB", "");
      const memUsedInPercent = Math.round((100 * memAvailable) / memTotal);

      if (!err) {
        const color =
          memUsedInPercent > 80
            ? "red"
            : memUsedInPercent > 60
            ? "yellow"
            : "brightgreen";

        const svg = makeBadge({
          label: "MEM ", // (Optional) Badge label
          message: `${memUsedInPercent.toString()} %`, // (Required) Badge message
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

module.exports = mem;
