const { t } = require('typy');
const jwt = require("jsonwebtoken");

const jsonpatch = require('jsonpatch');

const { success, error } = require('../../../helpers/responses');

exports.applyJsonPatch = async (req, res) => {
    const token = t(req.headers, 'token').safeString;
    if (!token) return res.status(403).json(error('Token not sent !!!', 403));

    const jsonObject = t(req.body, 'jsonObject').safeObject;
    if(!jsonObject) return res.status(403).json(error('JSON object not sent !!!', 403));

    const jsonPatchObject = t(req.body, 'jsonPatchObject').safeArray;
    if(!jsonPatchObject) return res.status(403).json(error('JSON patch object not sent !!!', 403));

    try {
        const decoded = jwt.verify(token, "randomString");

        try{
            const document = jsonpatch.apply_patch({...JSON.parse(req.body.jsonObject)}, [...JSON.parse(req.body.jsonPatchObject)]);
            res.status(200).json(success('JSON Patch applied !!!', {document: document}, 200));
        } catch (e) {
            res.status(403).json(error(e.message, 403));
        }

    } catch (e) {
        res.status(500).json(error('Invalid/Expired Token !!!', 500));
    }
}