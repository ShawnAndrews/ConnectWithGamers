export default function logIP(rawIp: string): void {
  const fs = require("fs");
  const filename = `iplog.txt`;
  const pathToFile = `${__dirname}/${filename}`;
  fs.exists(pathToFile, function (exists: boolean) {
    if (exists) {
      const formattedIp: string = rawIp.replace(/^.*:/, ``);
      if (formattedIp !== "1") {
        const today: Date = new Date();
        const data: string = `${today.toLocaleString()} | ${formattedIp}\n`;
        fs.appendFile(`${pathToFile}`, data, function(err: any) {
          if (err) {
            throw err;
          }
        });
      }
    } else {
      fs.writeFile(pathToFile, "", { flag: "wx" }, function (err: any) {});
    }
  });
}