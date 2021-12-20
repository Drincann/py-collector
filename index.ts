import express from 'express'
import fs from 'fs/promises'
import multer from 'multer'
import { RESCODE, responseData, allowedFileExt } from './util'
import path from 'path'
import { uploads } from './setting'
const app = express()


app.use(express.static(path.join(__dirname, 'public')))

app.get('/info', async (req, res) => {
    const time2files: { [time: string]: { url: string, name: string }[] } = {}
    const resData: {
        items?: {
            time: string,
            files: { url: string, name: string }[]
        }[]
    } = { items: [] }

    const dirents = await fs.readdir(uploads, { withFileTypes: true })

    for (const item of dirents) {
        const stat = await fs.stat(path.join(uploads, item.name))
        // 时间取当天凌晨
        const date = new Date(stat.birthtime)
        date.setHours(0, 0, 0, 0)
        // 转换为 年/月/日
        const dateStr = date.toISOString().slice(0, 10)
        if (!time2files[dateStr]) {
            time2files[dateStr] = []
        }
        time2files[dateStr].push({ url: `/uploads/${item.name}`, name: item.name })
    }
    for (const time in time2files) {
        resData.items?.push({ time, files: time2files[time] })
    }
    res.send(responseData(RESCODE.SUCCESS, resData))
})
app.post('/upload', multer({ limits: { fileSize: 1024 * 1024 * 50 } }).single('codePack',), async (req, res) => {
    try {
        if (req.body?.groupId?.trim?.() === '') {
            return res.json(responseData(RESCODE.PARAM_ERROR, { message: 'groupId is required' }))
        }

        if (!req.file) {
            return res.json(responseData(RESCODE.PARAM_ERROR, { message: 'file is required' }))
        }

        const { originalname, buffer } = req.file
        const groupId = Number.parseInt(req.body.groupId)
        if (!Number.isInteger(groupId)) {
            return res.json(responseData(RESCODE.PARAM_ERROR, { message: 'groupId is not integer' }))
        }

        const fileExt = path.extname(originalname)
        if (!(fileExt in allowedFileExt)) {
            return res.json(responseData(RESCODE.PARAM_ERROR,
                {
                    message: `file type error, except [".7z", ".zip", ".rar"], get ${fileExt}`
                }
            ))
        }

        await fs.writeFile(path.join(uploads, `${groupId}${fileExt}`), buffer)
        res.send(responseData(RESCODE.SUCCESS, { message: 'upload success' }))
    } catch (error: any) {
        res.json(responseData(RESCODE.FAIL, { message: error?.message ?? 'unknown error' }))
    }
})

app.listen(3000, () => {
    console.log('listening on port 3000')
})
