const multer = require('multer');
const fs = require('fs');
module.exports = multer.diskStorage({
    async destination(req, file, cb) {
        const getSubFolderName = (fileMimeType) => {
            let folderName;
            switch(fileMimeType) {
                case 'image': 
                    folderName = 'images'
                    break
                case 'audio': 
                    folderName = 'audios'
                    break
                case 'video': 
                    folderName = 'videos'
                    break
                case 'application': 
                    folderName = 'applications'
                    break
                default:
                    folderName = 'others'
            }
            return folderName
        }
        const validateFilePath = (filePath) => {
            try {
                stat = fs.statSync(filePath)
            } catch (err) {
                fs.mkdirSync(filePath)
            }
        }
        const folderName = getSubFolderName(file.mimetype.split('/')[0])
        const filePath = `uploads/${folderName}/`
        await validateFilePath(filePath)

      cb(null, filePath);
    },
    filename(req, file, cb) {
        const fileNameArr = file.originalname.split('.')
        const ext = fileNameArr.pop()
        const fileName = fileNameArr.join('.')
      cb(null, `${fileName}-${Date.now()}.${ext}`);
    },
  });