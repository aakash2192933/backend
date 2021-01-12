const { t } = require('typy');
const jwt = require("jsonwebtoken");

const { success, error } = require('../../../helpers/responses');
const { downloadImage } = require('../../../helpers/downloadImage');
const { resize } = require('../../../helpers/resizeImage');

exports.resizeImage = async (req, res) => {
    const token = t(req.headers, 'token').safeString;
    if (!token) return res.status(403).json(error('Token not sent !!!', 403));

    const imageUri = t(req.body, 'imageUri').safeString;
    if(!imageUri) return res.status(403).json(error('imageUri not sent !!!', 403));

    try{
        const decoded = jwt.verify(token, "randomString");

        try {
            downloadImage(imageUri, 'image.png', () => {
                res.type(`image/${'png'}`);
                resize('image.png', 50, 50).pipe(res);
    
                // res.status(200).json(success('Image resized !!!', {image: 'img'}, 200));
            })
        } catch (e) {
            console.log('Error: ', e);
            res.status(403).json(error('Unable to download/resize !!!', 403));
        }

    } catch (e) {
        console.log('Error: ', e);
        res.status(500).json(error('Invalid/Expired Token !!!', 500));
    }
}