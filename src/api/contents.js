const CONTENTS_FOLDER = process.env.REACT_APP_CONTENTS_FOLDER;
const API_ENDPOINT_URL =
  process.env.REACT_APP_LIST_CONTENTS_API_ENDPOINT + "/dev/";
const STORAGE_URL = process.env.REACT_APP_CONTENTS_BUCKET_URL;

const contentsApi = {
  async listContents() {
    const result = await fetch(API_ENDPOINT_URL + `?prefix=${CONTENTS_FOLDER}`);
    const jsonData = await result.json();
    return jsonData;
  },
  async getContent(filePath) {
    const response = await fetch(`${STORAGE_URL}/${filePath}`);
    const blobData = await response.blob();
    return blobData;
  },
};

export default contentsApi;