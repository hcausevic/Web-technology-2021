import crypto from 'crypto';

const alg = 'aes-256-ctr';
const sk = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';
const iv = crypto.randomBytes(16);
const enc = 'hex';

export const encrypt = (text, algorithm = alg, secretKey = sk) => {
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };
};

export const decrypt = (hash, algorithm = alg, secretKey = sk, encoding = enc) => {
    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, encoding));
    const decrypted = Buffer.concat([decipher.update(Buffer.from(hash.content, encoding)), decipher.final()]);
    return decrypted.toString();
};

export const generateUUID = () => {
    return crypto.randomBytes(16).toString('base64')
}

export const hash = (text, algorithm = alg, encoding = enc) => {
    return crypto.createHash(algorithm).update(text).digest(encoding)
}