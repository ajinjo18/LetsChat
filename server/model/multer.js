const multer=require('multer')

// Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('running1')

        // Specify the directory where uploaded files will be stored
        cb(null, './public/img');
    },
    filename: (req, file, cb) => {
        console.log('running2')

        console.log(file);
        // Define the filename for the uploaded file
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage: storage });

module.exports=upload