const PREFIX = process.env.REACT_APP_PREFIX;
const APIGW_URL = process.env.REACT_APP_APIGW_URL;

const contentsApi = {
  async listContents() {
    const result = await fetch(APIGW_URL + `?prefix=${PREFIX}`);
    const jsonData = await result.json();
    return jsonData;
  },
  async getContent(downloadUrl) {
    const response = await fetch(downloadUrl);
    // const contentType = response.headers.get('Content-Type')
    const blobData = await response.blob();
    return blobData
  },
};

export default contentsApi;
