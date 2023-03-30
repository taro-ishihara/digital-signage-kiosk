import { useState, useReducer, useEffect } from "react";

import React from "react";
import { useContents } from "../context/ContentsContext";

const ContentsManager = () => {
  const contents = useContents();
  const [loop, setLoop] = useState(false);
  const [index, dispatch] = useReducer((index, action) => {
    switch (action.type) {
      case "index/next":
        if (contents.length === 1) {
          setLoop(true);
          return 0;
        }
        if (index < contents.length - 1) {
          return index + 1;
        }
        return 0;
      default:
        return index;
    }
  }, 0);

  useEffect(() => {
    let duration = 1_000;
    if (contents.length > index) {
      duration = contents[index].duration;
    }
    const id = window.setTimeout(() => {
      dispatch({ type: "index/next" });
    }, duration);

    return () => {
      clearTimeout(id);
    };
  }, [contents, index]);

  const displayContent = () => {
    if (contents.length <= index) {
      return <img src="default.png" alt="" />;
    }
    switch (contents[index].contentType.split("/")[0]) {
      case "image":
        return (
          <img
            src={contents[index].objectUrl}
            alt={contents[index].downloadUrl}
          />
        );
      case "video":
        return (
          <video
            src={contents[index].objectUrl}
            alt={contents[index].downloadUrl}
            autoPlay
            loop={loop}
          />
        );
      default:
        return <img src="default.png" alt="" />;
    }
  };

  return displayContent();
};

export default ContentsManager;
