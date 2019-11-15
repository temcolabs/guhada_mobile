import API from 'childs/lib/API';

/**
 * 이미지 파일 업로드
 * http://dev.gateway.guhada.com/swagger-ui.html#/file-upload-controller
 *
 * @param {file} 파일 객체
 * @param {uploadPath} 업로드 경로. ex) ['COMMUNITY', 'BBS'] => /community/bbs
 * Available values : USER, SELLER, REVIEW, BRAND, PRODUCT, DEAL, OPTION, REPORT, USER_CLAIM, USER_SELLER_CLAIM, THUMBNAIL, DETAIL, CERTIFICATE, PROFILE, COMMUNITY, BBS, COMMENT
 */
async function uploadImageFile({ file, uploadPath = [] }) {
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

export default uploadImageFile;
