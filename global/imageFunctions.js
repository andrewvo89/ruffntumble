
import * as ImageManipulator from 'expo-image-manipulator';
import firebase from '../database/firebase';

const resizeImage = async ({ uri, width, format }) => {
  let imageUri = uri;
  if (!(imageUri.toString().startsWith('file://') || imageUri.toString().startsWith('https://'))) {//If not valid uri, return original uri
    return imageUri;
  }
  const newImage = await ImageManipulator.manipulateAsync(
    uri,//Input image uri
    [{ resize: { width } }],//Resize using width as parameter, height determined automatically to preserve aspect ratio
    { format }//PNG as default format
  );
  return newImage.uri;
};

const getPhotoUrl = async ({ collection, docId, folder, imageUri }) => {
  const file = await createFileFromUri(imageUri);
  const filename = imageUri.split('/').pop();
  const folderPath = `${collection}/${docId}/${folder}`
  const listAll = await firebase.storage().ref().child(folderPath).listAll();
  for (const item of listAll.items) {//Delete all existing profile pictures in user folder
    await firebase.storage().ref().child(item.fullPath).delete();
  }//Upload image, then use snapshot in promise to update profile property in the user database
  const uploadResult = await firebase.storage().ref().child(`${folderPath}/${filename}`).put(file);
  const downloadUrl = await firebase.storage().ref().child(uploadResult.ref.fullPath).getDownloadURL();
  return downloadUrl;
};

const createFileFromUri = async imageUri => {
  const response = await fetch(imageUri);
  const file = await response.blob();
  return file;
};

export default {
  getPhotoUrl,
  resizeImage
}