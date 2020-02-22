import * as AWS from 'aws-sdk';

const FILE_UPLOAD_S3_BUCKET = process.env.FILE_UPLOAD_S3_BUCKET

export function recoverS3AttachmentURL(todoId: string) : string{
    return `https://${FILE_UPLOAD_S3_BUCKET}.s3.us-east-1.amazonaws.com/${todoId}`
}

export function recoverS3PreSignedUrl(todoId: string): string {
    const s3 = new AWS.S3({ signatureVersion: 'v4' });
    const uploadUrl = s3.getSignedUrl('putObject', {
      Bucket: FILE_UPLOAD_S3_BUCKET,
      Key: todoId,
      Expires: 600 // Expires in 600s
    })
    return uploadUrl
}