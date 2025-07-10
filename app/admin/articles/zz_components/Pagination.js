import { useState } from "react";
import { useEffect } from "react";
import { fetchPageCount } from "../service";
import { Button } from "@material-tailwind/react";

const Pagination = ({ page, setPage }) => {
  const [pageCount, setPageCount] = useState(0);
  const [currentStartPage, setCurrentStartPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async (page) => {
    const result = await fetchPageCount();
    console.log(result);
    setPageCount(result);
    setLoading(false);
  };

  const onNextPress = () => {
    if (currentStartPage + 5 <= pageCount) {
      setCurrentStartPage(currentStartPage + 5);
    } else {
      setCurrentStartPage(pageCount - 4);
    }
  };

  return (
    <div className="flex justify-center mt-8">
      {currentStartPage > 1 && (
        <Button
          onClick={() => {
            setCurrentStartPage(currentStartPage - 5);
          }}
          className="mr-2"
        >
          {`<`}
        </Button>
      )}
      {["", "", "", "", ""].map((_, i) => {
        const pageNum = currentStartPage + i;
        if (pageNum > pageCount) return null;
        return (
          <Button
            key={i}
            onClick={() => {
              setPage(pageNum);
            }}
            className="mr-2"
            color="brown"
          >
            {pageNum}
          </Button>
        );
      })}
      {currentStartPage + 5 <= pageCount && (
        <Button onClick={onNextPress} className="mr-2">{`>`}</Button>
      )}
    </div>
  );
};

export default Pagination;
