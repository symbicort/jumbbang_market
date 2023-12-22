const { S3 } = require('@aws-sdk/client-s3');
const { createReadStream } = require('fs');
const { Readable } = require('stream');
const multer = require('multer');
const multerS3 = require('multer-s3');

const s3 = new S3({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const upload = multer({
    storage: multerS3({
        s3,
        bucket: process.env.AWS_S3_BUCKET_PROFILE,
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            cb(null, Date.now().toString() + '-' + file.originalname);
        },
    }),
});

const postUpload = multer({
    storage: multerS3({
        s3,
        bucket: process.env.AWS_S3_BUCKET_POST,
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: (req, file, cb) => {
            console.log('파일 이미지 업로드 시도');
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            cb(null, Date.now().toString() + '-' + file.originalname);
        },
    }),
});

function deleteProfileImg(bucketName, fileNameToDelete) {
    const filename = fileNameToDelete.substring(fileNameToDelete.lastIndexOf('/') + 1);
    const params = {
        Bucket: bucketName,
        Key: filename,
    };

    return s3
        .deleteObject(params)
        .then((data) => `Object ${fileNameToDelete} deleted successfully from ${bucketName}.`)
        .catch((err) => Promise.reject(`Error deleting object ${fileNameToDelete} from ${bucketName}: ${err.message}`));
}

module.exports = { upload, deleteProfileImg, postUpload };
