// TODO: 파일 업로드 API 정리
// http://dev.gateway.guhada.com/swagger-ui.html#/file-upload-controller

import API from 'lib/API';

/**
 * 이미지 파일 업로드
 * https://dev.gateway.guhada.com/swagger-ui.html#/file-upload-controller/uploadImageWithCloudFilePathUsingPOST
 *
 *
 * Available values : IMAGE, IMAGE_BRAND, IMAGE_BRAND_THUMBNAIL, IMAGE_BRAND_DETAIL, IMAGE_PRODUCT, IMAGE_PRODUCT_THUMBNAIL, IMAGE_PRODUCT_DETAIL, DOC_PRODUCT_CERTIFICATE, IMAGE_PRODUCT_OPTION, IMAGE_PRODUCT_OPTION_THUMBNAIL, IMAGE_PRODUCT_OPTION_DETAIL, IMAGE_USER, IMAGE_USER_SELLER, DOC_USER_SELLER, IMAGE_PRODUCT_REVIEW, IMAGE_BBS, IMAGE_BBS_COMMENT, DOCUMENT
 * @param {file} 파일 객체
 * @param {uploadPath} 업로드 경로.
 */
export async function uploadImageCloudFilePath({ file, cloudFilePath = '' }) {
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

/**
 * 이미지 파일 업로드
 * http://dev.gateway.guhada.com/swagger-ui.html#/file-upload-controller
 *
 * @param {file} 파일 객체
 * @param {uploadPath} 업로드 경로. ex) ['COMMUNITY', 'BBS'] => /community/bbs
 * Available values : USER, SELLER, REVIEW, BRAND, PRODUCT, DEAL, OPTION, REPORT, USER_CLAIM, USER_SELLER_CLAIM, THUMBNAIL, DETAIL, CERTIFICATE, PROFILE, COMMUNITY, BBS, COMMENT
 */
export async function uploadImageFile({ file, uploadPath = [] }) {
  try {
    const formData = new FormData();

    // 저장 경로 설정
    if (Array.isArray(uploadPath)) {
      uploadPath.forEach((path, index) => {
        formData.append(`cloudResourceList[${index}]`, path);
      });
    }

    formData.append('file', file);

    const { data } = await API.gateway.post(`/upload/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // * 결과 객체 형태
    // const {
    //   url,
    //   fileContentType,
    //   fileName,
    //   fileSize,
    //   imageHeight,
    //   imageWidth,
    // } = data.data;

    return data.data;
  } catch (e) {
    console.error(e);
    return e;
  }
}

/**
 * 이미지 파일 업로드
 * https://dev.gateway.guhada.com/swagger-ui.html#/file-upload-controller
 *
 * @param {file} 파일 객체
 * @param {uploadPath} 업로드 경로. uploadImageFile은 배열로 받지만 이건 문자열로 받는다
 */
export async function uploadImagePath({ file, uploadPath = '' }) {
  try {
    const formData = new FormData();

    formData.append('file', file);

    const { data } = await API.gateway.post(`/upload/image/path`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      params: {
        uploadPath,
      },
    });

    return data.data;
  } catch (e) {
    console.error(e);
    return e;
  }
}
