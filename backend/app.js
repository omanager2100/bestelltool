const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");
const sftpClient = require("ssh2-sftp-client");
const path = require("path");

const app = express();
const PORT = 3001;
app.use(cors());
app.use(bodyParser.json());

const users = require("./data/users.json");

function authenticate(username, password) {
  return users.find(u => u.username === username && u.password === password);
}

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (authenticate(username, password)) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

app.post("/submit", async (req, res) => {
  const { kundennummer, artikel } = req.body;
  const timestamp = Date.now();
  const filename = `bestellung_${kundennummer}_${timestamp}.csv`;
  const filepath = path.join(__dirname, "data", filename);
  const artikelData = fs.readFileSync(path.join(__dirname, "data", "artikel.csv"), "utf8");
  const lookup = {};
  artikelData.split("\n").forEach(line => {
    const [nr, name] = line.split("|");
    lookup[nr.trim()] = name.trim();
  });

  const content = artikel.map(item => {
    const bez = lookup[item.artikelnummer.trim()] || "";
    return [kundennummer, item.artikelnummer, bez, item.menge, item.einheit].join("|");
  }).join("\n");

  fs.writeFileSync(filepath, content);

  const sftp = new sftpClient();
  try {
    await sftp.connect({
      host: "ssh.strato.de",
      port: 22,
      username: "sftp_n8nData@domlab.de",
      password: "1PvdXQKv9CruWzv9nbPP"
    });
    await sftp.put(filepath, path.basename(filepath));
    await sftp.end();
    res.json({ success: true, file: filename });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => console.log("Server running on port " + PORT));