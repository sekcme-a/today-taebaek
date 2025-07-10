"use client";

import { useEffect } from "react";

const HandleViewCount = ({ articleId }) => {
  useEffect(() => {
    fetch(`/api/increment-view`, {
      method: "POST",
      body: JSON.stringify({ articleId: articleId }),
    });
  }, []);
  return <></>;
};

export default HandleViewCount;
