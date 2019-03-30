var {
  google
} = require("googleapis");
// import the Google drive module in google library
var drive = google.drive("v3");
// import our private key
var key = require("./private-key.json");

// import path ?? directories calls ??
var path = require("path");
// import fs ?? handle data in the file system ??
var fs = require("fs");

// retrieve a JWT
var jwToken = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key, ["https://www.googleapis.com/auth/drive"],
  null
);

jwToken.authorize((authErr) => {
  if (authErr) {
    console.log("error : " + authErr);
    return;
  } else {
    console.log("Authorization accorded");
  }
});


// list file in speciifcs folder
drive.files.list({
  auth: jwToken,
  pageSize: 10,
  fields: 'files(id, name)',
}, (err, {
  data
}) => {
  if (err) return console.log('The API returned an error: ' + err);
  const files = data.files;
  if (files.length) {
    console.log('Files:');
    files.map((file) => {
      console.log(`${file.name} (${file.id})`);
    });
  } else {
    console.log('No files found.');
  }
});

// upload file in specific folder
var folderId = "1K2LUKpkICUyqH9Mpg5SKDPiX6EqTKU0c";
var fileMetadata = {
  name:"electron-quick-start.zip",
  parents: [folderId]
};
var media = {
  body: fs.createReadStream(path.join(__dirname, '../electron-quick-start.zip'))
};
drive.files.create({
  auth: jwToken,
  resource: fileMetadata,
  media: media,
  fields: 'id'
}, function(err, file) {
  if (err) {
    // Handle error
    console.error(err);
  } else {
    console.log('File Id: ', file.id);
  }
});
