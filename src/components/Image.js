import { useEffect } from "react";

const Image = ({ filePath, objectUrl, duration, dispatch, forceFlipToggle }) => {
  useEffect(() => {
    const id = window.setTimeout(() => {
      dispatch({ type: "index/next" });
    }, duration);

    return () => {
      clearTimeout(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objectUrl, forceFlipToggle]);

  return <img src={objectUrl} alt={filePath} />;
};

export default Image;
