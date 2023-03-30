import { useState, useReducer } from "react";

import Image from "./Image.js";
import Video from "./Video.js";
import React from "react";
import { useContents } from "../context/ContentsContext";

const ContentsManager = () => {
  const contents = useContents();
  const [forceFlipToggle, setForceFlipToggle] = useState(false);

  const [index, dispatch] = useReducer((index, action) => {
    switch (action.type) {
      case "index/next":
        if (contents.length < 2) {
          setForceFlipToggle(!forceFlipToggle);
          return 0;
        }
        if (index < contents.length - 1) {
          return index + 1;
        } else {
          return 0;
        }
      default:
        return index;
    }
  }, 0);

  return contents.length === 0 ? (
    <img src="default.png" alt="" />
  ) : contents[index].contentType.startsWith("image") ? (
    <Image
      {...contents[index]}
      dispatch={dispatch}
      forceFlipToggle={forceFlipToggle}
    />
  ) : (
    <Video
      {...contents[index]}
      dispatch={dispatch}
      forceFlipToggle={forceFlipToggle}
    />
  );
};

export default ContentsManager;
