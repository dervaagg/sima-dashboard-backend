const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (data) => {
    try {
        let dosen = true;
        // Find akun in akun_dosen table
        let akun = await prisma.tb_akun_dosen.findFirst({
            where: {
                username: data.username,
            },
            include: {
                fk_pemilik: true,
            },
        });

        // Not a dosen
        if (!akun) {
            dosen = false;
            akun = await prisma.tb_akun_mhs.findUnique({
                where: {
                    username: data.username,
                },
                include: {
                    fk_pemilik: true,
                },
            });
        }

        // User not found
        if (!akun) throw new Error("User not found");

        if (akun.status != "Aktif") throw new Error("Akun tidak dapat digunakan");

        // Compare akun password
        let firstTime = false;
        if (!akun.fk_pemilik.email) {
            firstTime = true;
        }

        let passwordMatch = false;
        if (firstTime) {
            passwordMatch = data.password === akun.password;
        } else {
            passwordMatch = await bcrypt.compare(data.password, akun.password);
        }

        if (passwordMatch) {
            // Find owner
            let role = "Mahasiswa",
                nama = "",
                id = "";

            if (!dosen) {
                // Mahasiswa has no role
                id = akun.fk_pemilik.nim;
            } else {
                id = akun.fk_pemilik.nip;
                jsonRole = await prisma.tb_role_akun_dosen.findMany({
                    where: {
                        username: akun.username,
                    },
                });

                // Akun doesn't have any role
                if (!jsonRole) throw new Error("User doesn't have any role");

                // Parse JSON role as array
                role = [];
                jsonRole.forEach((r) => {
                    role.push(r.role);
                });
            }

            // Get nama and image
            nama = akun.fk_pemilik.nama;
            foto = akun.fk_pemilik.foto;

            // Create new token
            const userAccessToken = jwt.sign(
                { id: id, role: role },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "1h" }
            );

            return {
                id: id,
                role: role,
                nama: nama,
                image: foto,
                firstTime: firstTime,
                accessToken: userAccessToken
            };
        } else {
            throw new Error("Wrong password");
        }
    } catch (err) {
        throw err;
    }
};
module.exports = { login };
