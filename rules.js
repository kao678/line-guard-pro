const fs = require("fs");
const db = require("./data.json");

function save() {
  fs.writeFileSync("./data.json", JSON.stringify(db, null, 2));
}

function getGroup(groupId) {
  let g = db.groups.find(x => x.groupId === groupId);
  if (!g) {
    g = {
      groupId,
      rules: {
        link: true,
        flex: true,
        join: true
      }
    };
    db.groups.push(g);
    save();
  }
  return g;
}

function setRule(groupId, rule, value) {
  const g = getGroup(groupId);
  g.rules[rule] = value;
  save();
}

module.exports = {
  getGroup,
  setRule
};
