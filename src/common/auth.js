import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const hashPassword = async (password) => {
    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(password, salt);
    return hash;
};

const hashCompare = async (password, hash) => {
    console.log("inside compare");
    return await bcrypt.compare(password, hash);
};

const createToken = async (payload) => {
    console.log("inside create token");
    const token = await jwt.sign(payload, "hackathon_servicedesk_secret_key", {
        expiresIn: "1hr"
    })
    return token;
};

const decodeToken = async (token) => {
    const payload = await jwt.decode(token);
    return payload;
};

const validate = async (req, res, next) => {
    try {
        let token = req.headers.authorization?.split(" ")[1];
        if (token) {
            let payload = await decodeToken(token);
            req.headers.userId = payload.id;
            let currentTime = (+new Date()) / 1000;

            if (currentTime < payload.exp) {
                next();
            }
            else
                res.status(401).send({ message: "Token Expired" });
        }
        else {
            res.status(401).send({ message: "No Token Found" });
        }
    } catch (err) {
        res.status(401).send({ message: "Token Invalid" });
    }
};

const adminGaurd = async (req, res, next) => {
    let token = req.headers.authorization?.split(" ")[1];
    if (token) {
        let payload = await decodeToken(token);
        if (payload.role === 'admin')
            next();
        else
            res.status(401).send({ message: "Only Admins are allowed" });
    }
    else {
        res.status(401).send({ message: "No Token Found" });
    }
}

export default {
    hashPassword,
    hashCompare,
    createToken,
    validate,
    adminGaurd
};
