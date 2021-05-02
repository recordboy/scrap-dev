import React from "react";

const SearchLoading = (props: { isOnLoading: boolean }) => {
  const { isOnLoading } = props;
  return (
    <div className={isOnLoading ? "loading on" : "loading"}><div className="loading-inner">
      <div></div><div></div><div></div><div></div><div></div>
    </div></div>
  );
};

export default SearchLoading;
