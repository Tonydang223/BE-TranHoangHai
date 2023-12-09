const cloudinary = require('cloudinary').v2;

cloudinary.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: process.env.CLOUDINARY_NAME
});

const uploads = (file, folder, id) => {
    return new Promise((resolve, reject) => cloudinary.uploader.upload(file, {
            upload_preset: folder,
        }, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        })
    ) 
}


const getUploaded = async (folder) => {
   const resources = await cloudinary.api.resources({prefix:`${folder}/`, type:'upload'})
   return resources;
}

module.exports = {uploads,getUploaded}