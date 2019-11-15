import API from 'lib/API';

/**
 * 이미지 파일 업로드
 * https://dev.gateway.guhada.com/swagger-ui.html#/file-upload-controller
 *
 * @param {file} 파일 객체
 * @param {uploadPath} 업로드 경로. uploadImageFile은 배열로 받지만 이건 문자열로 받는다
 */
async function uploadImagePath({ file, uploadPath = '' }) {
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

export default uploadImagePath;
