import React, { useState } from "react";
import SearchForm from "./components/SearchForm";
import SearchLoading from "./components/SearchLoading";
import SearchList from "./components/SearchList";
import "./App.css";

function App() {
  const [searchData, setSearchData] = useState<any>([]);
  const [isOnLoading, setIsOnLoading] = useState(false);
  const getData = (keyword: string, pageNum: number) => {
    setIsOnLoading(true);
    console.log("검색 키워드: " + keyword);
    console.log("검색 페이지: " + pageNum);

    fetch(`api/data?keyword=${keyword}&pageNum=${pageNum}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setSearchData(data);
        setIsOnLoading(false);
        console.log(data);
      });

    fetch(`api/page`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
      });
  };
  return (
    <div className="App">
      <SearchForm getData={getData} isOnLoading={isOnLoading} />
      <SearchLoading isOnLoading={isOnLoading} />
      <SearchList searchData={searchData} isOnLoading={isOnLoading} />
    </div>
  );
}

export default App;