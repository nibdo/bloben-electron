const fs = require("fs");
const os = require("os");

export const log = (message: string) => {
  const dir = `${os.tmpdir()}/bloben_cache`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  fs.appendFileSync(`${dir}/combined.log`, `${JSON.stringify({message: `[ELECTRON]: ${message}`, timestamp: new Date().toISOString()})}\n`);
};

let wasNetworkLogInit = false

export const logNetwork = (data: any) => {
  const dir = `${os.tmpdir()}/bloben_cache`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  if (!wasNetworkLogInit) {
    fs.writeFileSync(`${dir}/network.log`, `${JSON.stringify({...data, timestamp: new Date().toISOString()})}\n`);
    wasNetworkLogInit = true
  } else {
    fs.appendFileSync(`${dir}/network.log`, `${JSON.stringify({...data, timestamp: new Date().toISOString()})}\n`);
  }
}
