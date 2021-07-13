import React, { useState, useEffect } from "react";
import SearchItem from "./SearchItem";

const SearchList = (props: { searchData: []; isOnLoading: boolean }) => {
  const { searchData, isOnLoading } = props;
  const [style, setStyle] = useState({});
  let timer: any = null;

  useEffect(() => {
    setStyle({ columnCount: getColumn(window.innerWidth) });
  }, []);

  window.addEventListener("resize", function () {
    clearTimeout(timer);
    timer = setTimeout(function () {
      setStyle({ columnCount: getColumn(window.innerWidth) });
    }, 300);
  });

  function getColumn(width: number): string {
    let column: string = "";
    if (width < 360) {
      column = "2";
    } else if (width >= 360 && width < 600) {
      column = "3";
    } else if (width >= 600 && width < 900) {
      column = "4";
    } else if (width >= 900 && width < 1200) {
      column = "5";
    } else if (width >= 1200 && width < 1500) {
      column = "6";
    } else if (width >= 1500) {
      column = "7";
    } else {
      column = "8";
    }
    return column;
  }

  return (
    <div
      className={isOnLoading ? "card-list disable" : "card-list"}
      style={style}
    >
      {searchData.map(
        (item: any, idx: number): JSX.Element => {
          if (item.kategorie && item.kategorie && item.text) {
            return <SearchItem key={idx} item={item} />;
          } else {
            return (
              <div key={idx} className="none">
                검색결과 없음
              </div>
            );
          }
        }
      )}
    </div>
  );
};

export default SearchList;