import express from 'express'
import fs from 'fs/promises'
import multer from 'multer'
import { RESCODE, responseData, allowedFileExt } from './util'
import path from 'path'
import { uploads } from './setting'
const app = express()


app.use(express.static(path.join(__dirname, 'public')))

app.post('/upload', multer({ limits: { fileSize: 1024 * 1024 * 50 } }).single('codePack',), async (req, res) => {
    try {
        if (req.body?.groupId == undefined) {
            return res.json(responseData(RESCODE.PARAM_ERROR, { message: 'groupId is required' }))
        }

        if (req.file == undefined) {
            return res.json(responseData(RESCODE.PARAM_ERROR, { message: 'file is required' }))
        }

        const { originalname, buffer } = req.file
        const groupId = req.body.groupId

        const fileExt = path.extname(originalname)
        if (!(fileExt in allowedFileExt)) {
            return res.json(responseData(RESCODE.PARAM_ERROR,
                {
                    message: `file type error, except [".7z", ".zip", ".rar"], get ${fileExt}`
                }
            ))
        }

        await fs.writeFile(path.join(uploads, `第${groupId}组${fileExt}`), buffer)
        res.send(responseData(RESCODE.SUCCESS, { message: 'upload success' }))
    } catch (error: any) {
        res.json(responseData(RESCODE.FAIL, { message: error?.message ?? 'unknown error' }))
    }
})

app.listen(3000, () => {
    console.log('listening on port 3000')
})
