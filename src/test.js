const audioFilePath = `../recordings/5701.wav`;
const fs = require("fs");
const audioFileStream = fs.createReadStream(audioFilePath);
const key = require('../db/service_account.json');
const driveFolder = require("../db/drive_info.json").folder_id;
const { google } = require('googleapis');
const scopes = ['https://www.googleapis.com/auth/drive']; 

const auth = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key,
  scopes
);

const drive = google.drive({
  version: 'v3',
  auth,
});

const fileMetadata = {
  name: `5701.wav`,
  parents: [driveFolder]
};

const media = {
  mimeType: 'audio/wave',
  body: audioFileStream,
};

const permissions = {
  'role': 'reader',
  'type': 'anyone',
  'withLink': true,
};

drive.files.create({
  resource: fileMetadata,
  media: media,
  fields: 'id',
}).then(file => {
  console.log(`File ID: ${file.data.id}`);
  const fileUrl = `https://drive.google.com/file/d/${file.data.id}/view?usp=sharing`;
  console.log(`File URL: ${fileUrl}`);
}).catch(e => {
  console.log(`Error uploading file to Drive: ${e}`);
});