import API from 'childs/lib/API';

/**
 * 이미지 파일 업로드
 * https://dev.gateway.guhada.com/swagger-ui.html#/file-upload-controller/uploadImageWithCloudFilePathUsingPOST
 *
 *
 * Available values : IMAGE, IMAGE_BRAND, IMAGE_BRAND_THUMBNAIL, IMAGE_BRAND_DETAIL, IMAGE_PRODUCT, IMAGE_PRODUCT_THUMBNAIL, IMAGE_PRODUCT_DETAIL, DOC_PRODUCT_CERTIFICATE, IMAGE_PRODUCT_OPTION, IMAGE_PRODUCT_OPTION_THUMBNAIL, IMAGE_PRODUCT_OPTION_DETAIL, IMAGE_USER, IMAGE_USER_SELLER, DOC_USER_SELLER, IMAGE_PRODUCT_REVIEW, IMAGE_BBS, IMAGE_BBS_COMMENT, DOCUMENT
 * @param {file} 파일 객체
 * @param {uploadPath} 업로드 경로.
 */
async function uploadImageCloudFilePath({ file, cloudFilePath = '' }) {
  try {
    const formData = new FormData();

    formData.append('file', file);

    const { data } = await API.gateway.post(
      `/upload/image/path/${cloudFilePath}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return data.data;
  } catch (e) {
    console.error(e);
    return e;
  }
}

export default uploadImageCloudFilePath;
