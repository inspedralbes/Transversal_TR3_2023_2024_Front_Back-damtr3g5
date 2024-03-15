const fs = require('fs');
const path = require('path');

/**
 * Uploads a file to a specified folder.
 * @param {Object} file - The file to be uploaded.
 * @param {string} folder - The folder where the file will be uploaded.
 * @returns {Promise<Object>} A promise that resolves to an object with a success message or rejects with an error message.
 */
const uploadFile = async (file, folder) => {
    try {
        return new Promise((resolve, reject) => {

            const fileName = file.originalname;
            const uploadPath = path.join(__dirname, 'skins', folder, fileName);
            fs.rename(file.path, uploadPath, (err) => {
                if (err) {
                    reject({ error: 'Error al subir el archivo.' });
                } else {
                    resolve({ message: 'Archivo subido correctamente.', name: folder+"/"+fileName });
                }
            });
        })
    } catch (e) {
        return { error: e };
    }

}
/**
 * Converts a message object into a standardized response object.
 * @param {Object} mensaje - The message object to be converted.
 * @returns {Object} - The converted response object.
 */
const respuesta = (mensaje) => {
    if (mensaje.hasOwnProperty("error")) {
        return { error: mensaje.error }
    } else {
        return { message: mensaje.message }
    }
}
function getImageNames(mainFolder) {
    const folders = {};
    const files = fs.readdirSync(mainFolder);
    for (const file of files) {
        const filePath = path.join(mainFolder, file);

        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            const subfolderImages = getImageNames(filePath);
            Object.assign(folders, subfolderImages);
        } else {
            if (isImage(file)) {
                const folderName = path.basename(mainFolder);
                if (!folders[folderName]) {
                    folders[folderName] = [];
                }
                folders[folderName].push(file);
            }
        }
    }

    return folders;
}
function isImage(filename) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
    const ext = path.extname(filename).toLowerCase();
    return imageExtensions.includes(ext);
}
module.exports = { uploadFile, respuesta, getImageNames}