import { createContext, useContext, useReducer, useEffect } from "react";

import contentsApi from "../api/contents";

const ContentsContext = createContext();

const localContentList = [];
const serverContentList = [];

const localContentsReducer = (localContentList, action) => {
  switch (action.type) {
    case "localContent/create":
      const newLocalContent = {
        ...action.payload,
      };
      return [...localContentList, newLocalContent];
    case "localContent/delete":
      return localContentList.filter((localContent) => {
        if (localContent.downloadUrl !== action.payload) {
          return true;
        } else {
          window.URL.revokeObjectURL(localContent.objectUrl);
          return false;
        }
      });
    default:
      return localContentList;
  }
};

const serverContentsReducer = (serverContentList, action) => {
  switch (action.type) {
    case "serverContent/create":
      return [...serverContentList, action.payload];
    case "serverContent/clear":
      return [];
    default:
      return serverContentList;
  }
};

const intervalSync = (dispatch) => {
  const CONTENTS_REFRESH_INTERVAL_MS = 60_000;
  const sync = async () => {
    const jsonData = await contentsApi.listContents();
    console.log("json", jsonData);

    dispatch({
      type: "serverContent/clear",
    });
    jsonData.forEach((content) => {
      dispatch({
        type: "serverContent/create",
        payload: content,
      });
    });
    window.setTimeout(sync, CONTENTS_REFRESH_INTERVAL_MS);
  };
  sync();
};

const localContentsRefresh = (serverContents, localContents, dispatch) => {
  // サーバーから削除されたものを削除
  localContents
    .filter((lc) => {
      return (
        -1 ===
        serverContents.findIndex(
          (sc) => sc.downloadUrl === lc.downloadUrl && sc.etag === lc.etag
        )
      );
    })
    .forEach((target) => {
      console.log("delete start", target.etag);
      dispatch({
        type: "localContent/delete",
        payload: target.downloadUrl,
      });
    });

  // サーバーに作成されたものを作成
  serverContents
    .filter((sc) => {
      return (
        -1 ===
        localContents.findIndex(
          (lc) => sc.downloadUrl === lc.downloadUrl && sc.etag === lc.etag
        )
      );
    })
    .forEach((target) => {
      console.log("download start", target.etag);
      (async () => {
        const blobData = await contentsApi.getContent(target.downloadUrl);
        const objectUrl = window.URL.createObjectURL(blobData);
        let duration = 5_000;
        if (blobData.type.startsWith("video")) {
          duration = await (() => {
            return new Promise((resolve) => {
              const video = document.createElement("video");
              video.onloadedmetadata = () =>
                resolve(Math.round(video.duration * 1000));
              video.src = objectUrl;
            });
          })();
        }
        dispatch({
          type: "localContent/create",
          payload: {
            objectUrl: objectUrl,
            duration: duration,
            blobData: blobData,
            contentType: blobData.type,
            downloadUrl: target.downloadUrl,
            etag: target.etag,
          },
        });
      })();
    });
};

const ContentsProvider = ({ children }) => {
  const [localContents, localContentsDispatch] = useReducer(
    localContentsReducer,
    localContentList
  );
  const [serverContents, serverContentsDispatch] = useReducer(
    serverContentsReducer,
    serverContentList
  );

  // 定期的にサーバーのコンテンツと同期
  useEffect(() => intervalSync(serverContentsDispatch), []);

  // サーバーが更新された時にローカル側を更新
  useEffect(() => {
    localContentsRefresh(serverContents, localContents, localContentsDispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverContents]);

  return (
    <ContentsContext.Provider value={localContents}>
      {children}
    </ContentsContext.Provider>
  );
};

const useContents = () => useContext(ContentsContext);

export { ContentsProvider, useContents };
