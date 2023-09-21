//Multer Hope to handle file upload locally
const multer = require('multer');
const path = require('path');


module.exports = {
  //Where we gonna save
  storage : multer.diskStorage({
    //Where to save
    //Get out of config out of src and save it in files folder
    destination : path.resolve(__dirname, "..", "..", "files"),
    //REQUIRES US TO PASS
    filename : (req,file,cb) =>{
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext);

      //What's inside replace is that it takes all the white spaces and concatenates
      //So we are getting somethin like soccertournament-120201020.jpg
      cb(null,`${name.replace(/\s/g,"")}-${Date.now()}${ext}` )
    }
  })
}
