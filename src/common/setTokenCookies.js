export default function (res, token) {
    res.cookie('authToken', token, {
        httpOnly: true,
        secure: true,
        maxAge: 6 * 60 * 60 * 1000 // 6 hour
    });
}
