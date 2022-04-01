const bcrypt = require("bcryptjs");
const userModel = require("../models/users.model");
const jwt = require("jsonwebtoken");
const authentication = require("../middlewares/authentication");

var AuthController = {
    login: async function (req, res) {
        res.setHeader("Content-Type", "application/json");
        if (req.body.hasOwnProperty("email") && req.body.hasOwnProperty("password")) {
            const email = req.body.email;
            const password = req.body.password;
            const user = await userModel.findOne({ email });
            // If user email exists in DB, ...
            if (user) {
                // And, if is valid password,
                if (bcrypt.compareSync(password, user.password)) {
                    // We create a new brand jwt token
                    const token = jwt.sign(
                        { userId: user._id },
                        process.env.SESSION_SECRET,
                        {
                            expiresIn: "24h",
                        }
                    );
                    const {
                        role,
                        civility,
                        _id,
                        lastName,
                        firstName,
                        email,
                        password,
                        userDate,
                        condition,
                    } = user;

                    res.status(200).send({
                        role,
                        civility,
                        _id,
                        lastName,
                        firstName,
                        email,
                        password,
                        userDate,
                        condition,
                        token,
                    });
                } else {
                    res.status(400).end(JSON.stringify({ message: "Wrong password" }));
                }
            } else {
                res.status(400).end(JSON.stringify({ message: "Wrong email" }));
            }
        } else {
            res.status(400).end(JSON.stringify({ message: "Invalid request" }));
        }
    },

    register: async function (req, res) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new userModel({
            lastName: req.body.lastName,
            firstName: req.body.firstName,
            birthdate: req.body.birthdate,
            userDate: new Date(),
            address: req.body.address,
            role: req.body.role,
            civility: req.body.civility,
            email: req.body.email,
            coachId: req.body.coachId,
            password: hashedPassword,
            condition: "good",
        });
        try {
            const newUser = await user.save();
            if (newUser) {
                const token = jwt.sign(
                    { userId: newUser._id },
                    process.env.SESSION_SECRET,
                    {
                        expiresIn: "24h",
                    }
                );

                const {
                    role,
                    civility,
                    _id,
                    lastName,
                    firstName,
                    email,
                    password,
                    userDate,
                    condition,
                } = newUser;

                res.status(200).send({
                    role,
                    civility,
                    _id,
                    lastName,
                    firstName,
                    email,
                    password,
                    userDate,
                    condition,
                    token,
                });
            }
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    logout: async function (req, res) {
        const token = authentication.extractBearerToken(req.headers.authorization);
        console.log(`_id`, token);
        const decodedJWT = jwt.decode(token, process.env.SESSION_SECRET);
        console.log(`decodedJWT`, decodedJWT);

        const _id = decodedJWT.userId;

        const user = await userModel.findOne({ _id });

        if (user) {
            const token = jwt.sign({ userId: _id }, process.env.SESSION_SECRET, {
                expiresIn: "1ms",
            });
            res.status(200).append("Authorization", `Bearer ${token}`).send({});
        } else {
            throw error;
        }
    },
};

module.exports = AuthController;