export default function (req, res) {
    const fileDescription = req.file;
    const filePath = req.file.path;
    console.log("File Description:", fileDescription);

    return res.status(200).send({
        "message": "File Uploaded Successfully",
        filePath
    });
};
