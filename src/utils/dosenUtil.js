const bcrypt = require("bcrypt");
function convertUsername(name) {
    name = name.replace(
        /(Dr\.?|Drs\.?|Eng\.?|S\.?S\.?i\.?|S\.?T\.?|M\.?T\.?|S\.?K\.?om\.?|M\.?K\.?om\.?|M\.?Cs\.?|B\.?Eng\.?|A\.?Md\.?)/g,
        ""
    );
    name = name.replace(/,/g, "");
    name = name.split(" ").filter((item) => item !== "");
    if (name.length > 2) {
        name = name.slice(0, 2);
    }
    name = name.join("").toLowerCase();
    return name;
}

function hashPassword(name) {
    name = convertUsername(name);
    return bcrypt.hashSync(name, 10);
}

function getRole(name) {
    const regex =
        /(Dr\.?|Drs\.?|S\.?S\.?i\.?|S\.?T\.?|M\.?T\.?|S\.?K\.?om\.?|M\.?K\.?om\.?|M\.?Cs\.?|B\.?Eng\.?)/g;
    if (regex.test(name)) {
        return "Dosen";
    } else {
        return "Operator";
    }
}

module.exports = { convertUsername, getRole, hashPassword };
