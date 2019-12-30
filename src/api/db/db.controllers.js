'use strict'

const { vField } = require('../../helper/validate')
const { getColInfo, exportDB, importDB } = require('../../db/db')
const { listDir, uploadDB, downloadDB } = require('../../helper/OSS')

/**
 * @method index
 * @param { null }
 * @returns { data }
 * @description admin 
 */
exports.index = async (req, res, next) => {
    const data = await getColInfo()
    const dbname = process.env.MONGODB_URI.split('/')[3]
    res.json({ code: "000000", data: { data, dbname } })
}

/**
 * @method export
 * @param { Object }
 * @returns { Boolean }
 * @description admin 
 */
exports.export = async (req, res, next) => {
    vField(req.body, ["dbname", "colname", "filename"])

    const dbname = req.body.dbname
    const colname = req.body.colname
    const filename = req.body.filename

    await exportDB(colname)
    await uploadDB(dbname, colname, filename)
    res.json({ code: "000000", data: { data: true } })
}

/**
 * @method list
 * @param { Object }
 * @returns { data }
 * @description admin 
 */
exports.list = async (req, res, next) => {
    vField(req.body, ["dbname", "colname"])

    const dbname = req.body.dbname
    const colname = req.body.colname

    const data = await listDir(`mongo/${dbname}/${colname}/`)
    res.json({ code: "000000", data })
}

/**
 * @method import
 * @param { Object }
 * @returns { Boolean }
 * @description admin 
 */
exports.import = async (req, res, next) => {
    vField(req.body, ["dbname", "colname", "filename"])

    const dbname = req.body.dbname
    const colname = req.body.colname
    const filename = req.body.filename

    await downloadDB(dbname, colname, filename)
    await importDB(colname)
    res.json({ code: "000000", data: { data: true } })
}