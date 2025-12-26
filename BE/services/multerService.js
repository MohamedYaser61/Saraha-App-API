import multer from 'multer';

export const multerFun = () => {
    // Destination to store image
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            console.log(file);
            cb(null, 'uploads/');
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname)
        }

    })

    // Filter uploaded data
    const fileFilter = (req, file, cb) => {
        if (file.mimetype === 'application/pdf' || file.mimetype === 'image/jpeg') {
            cb(null, file);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }

    const uploadFile = multer({ fileFilter, storage });
    return uploadFile;
}

