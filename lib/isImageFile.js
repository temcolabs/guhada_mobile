export const isImageFile = (
  imageFile,
  regex = /^image\/(png|jpg|jpeg|gif)$/i
) => {
  return (
    imageFile &&
    imageFile.constructor.name === 'File' &&
    regex.test(imageFile.type)
  );
};
