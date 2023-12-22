const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const s3 = new aws.S3();

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_S3_BUCKET_PROFILE,
        acl: 'public-read', // 파일 접근 권한 (public-read로 해야 업로드 된 파일이 공개)
        contentType: multerS3.AUTO_CONTENT_TYPE, // 자동 감지
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            cb(null, Date.now().toString() + "-" + file.originalname);
        }
    })
})

const postUpload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_S3_BUCKET_POST,
        acl: 'public-read', // 파일 접근 권한 (public-read로 해야 업로드 된 파일이 공개)
        contentType: multerS3.AUTO_CONTENT_TYPE, // 자동 감지
        metadata: (req, file, cb) => {
            console.log('파일 이미지 업로드 시도')
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            cb(null, Date.now().toString() + "-" + file.originalname);
        }
    })
})

function deleteProfileImg(bucketName, fileNameToDelete) {
    const filename = fileNameToDelete.substring(fileNameToDelete.lastIndexOf("/") + 1);
    const params = {
        Bucket: bucketName,
        Key: filename
    };

    return new Promise((resolve, reject) => {
        s3.deleteObject(params, (err, data) => {
            if (err) {
                reject(`Error deleting object ${fileNameToDelete} from ${bucketName}: ${err}`);
            } else {
                resolve(`Object ${fileNameToDelete} deleted successfully from ${bucketName}.`);
            }
        });
    });
}

module.exports = {upload, deleteProfileImg, postUpload};