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

  return <video src={objectUrl} alt={filePath} autoPlay />;
};

export default Image;
