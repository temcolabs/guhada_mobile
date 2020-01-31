import API from 'childs/lib/API';

export async function uploadProfileFile({ file, userId }) {
  try {
    const formData = new FormData();

    formData.append('file', file);

    const { data } = await API.user.post(
      `users/${userId}/profile-image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data;
  } catch (e) {
    console.error(e);
    return e;
  }
}

export async function deleteProfileFile({ userId }) {
  try {
    const { data } = await API.user.delete(
      `http://dev.user.guhada.com/users/${userId}/profile-image`
    );

    return data;
  } catch (e) {
    console.error(e);
    return e;
  }
}
