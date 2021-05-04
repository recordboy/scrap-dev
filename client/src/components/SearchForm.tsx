import React, { useState } from "react";
import { Button, TextField, Slider } from "@material-ui/core";

const SearchForm = (props: { getData: any; isOnLoading: boolean }) => {
  const { getData, isOnLoading } = props;
  const [keyword, setKeyword] = useState("");
  let pageNum: number = 5;

  return (
    <div className={isOnLoading ? "form disable" : "form"}>
      <TextField
        className="form-text"
        label="search"
        variant="outlined"
        disabled={isOnLoading ? true : false}
        onChange={(e: any) => {
          setKeyword(e.target.value);
        }}
        onKeyPress={(e: any) => {
          if (e.charCode === 13) {
            if (keyword) {
              getData(keyword, pageNum);
            }
          }
        }}
      />

      <Button
        type="button"
        className="form-btn"
        disabled={isOnLoading ? true : false}
        variant="contained"
        color="primary"
        onClick={() => {
          if (keyword) {
            getData(keyword, pageNum);
          }
        }}
      >
        search
      </Button>
      {/* <Slider
        className="form-page"
        defaultValue={pageNum}
        getAriaValueText={(value: number) => {
          return `${value}`;
        }}
        aria-labelledby="discrete-slider"
        valueLabelDisplay="auto"
        step={10}
        marks
        min={10}
        max={50}
      /> */}
    </div>
  );
};

export default SearchForm;