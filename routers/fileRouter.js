const express = require('express');
const router = express.Router();
const multer = require('multer');
const File = require('../model/File');
const mongoose = require('mongoose');
const fs = require('fs');
const isAuthorized = require('../controller/requestAuthenticator');
const storage = require('../controller/storageController');

const upload = multer({ storage: storage });

router.get('/file', isAuthorized, (req, res) => {
    File.find({createdBy: req.userId})
    .select({originalName: 1, filePath: 1, mimeType:1, size: 1})
    .exec()
    .then( files => {
        res.send(files)
    })
    .catch(er => {
        res.status(500).json({
            error: er
        });
    });
})

router.get('/file/:id', isAuthorized, (req, res) => {
    const id = mongoose.Types.ObjectId(req.params.id)
    File.find({createdBy: req.userId, _id: id})
    .select({originalName: 1, filePath: 1, mimeType:1, size: 1})
    .exec()
    .then( files => {
        res.send(files[0])
    })
    .catch(er => {
        res.status(500).json({
            error: er
        });
    });
})

router.post('/file', isAuthorized, upload.array('files', 12), (req, res) => {
    const files = req.files
    if (!files) {
        const error = new Error('Please choose files')
        error.httpStatusCode = 400
        res.send({success: false, error: error})
    }
    console.log(files);
    const filePromise = new Promise( async(resolve, reject) => {
        let resFileNames = []
        let resErrors = []
        await Promise.all(files.map( async(file) => {
            const fileData = new File({
                name: file.filename,
                originalName: file.originalname,
                mimeType: file.mimetype,
                directoryPath: file.destination,
                filePath: file.path,
                size: file.size,
                createdBy: req.userId,
                createdAt: new Date().toISOString()
            });

            await fileData.save()
            .then(doc => {
                resFileNames.push(doc.originalName)
            })
            .catch(err => {
                resErrors.push(err)
            })
        }))
        resolve({status: (resFileNames.length === files.length),filesUploaded: resFileNames, errors: resErrors})
    })

    filePromise.then((resp) => res.send(resp))
})

router.put('/file/:id', isAuthorized, (req, res) => {
    const id = mongoose.Types.ObjectId(req.params.id)
    const fileName = req.body.fileName
    File.updateMany({_id: id}, {originalName: fileName}, (err, raw) => {
        if(err) {
            res.send(500).send({status: 'error', error: err})
        }
        const {nModified: n} = raw
        res.send({status: (n > 0) ? `Updated ${n} docs` : 'No Changes detected'})
    })
})

router.delete('/file/:id', isAuthorized, (req, res) => {
    const id = mongoose.Types.ObjectId(req.params.id)
    const query = {_id: id}
    File.find(query)
    .exec()
    .then(files => {
        if (files.length === 0)
            res.status(500).json({status: 'error', error: 'Unable to find the file id'})

        fs.unlink(files[0].filePath, (err) => {
            if (err) {
                res.status(500).json({status: 'error', error: err})
            }
          
            File.deleteOne(query, (err) => {
                if(err) {
                    res.status(500).json({status: 'error', error: err})
                }
                res.send({status: true})
            })
          })
    })
})

module.exports = router