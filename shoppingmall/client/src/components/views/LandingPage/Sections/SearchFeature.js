import React, { useState } from "react";
import { Input } from "antd";

const { Search } = Input;

const SearchFeature = (props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const searchHandler = (event) => {
    setSearchTerm(event.currentTarget.value);
    props.refreshFunction(event.currentTarget.value); // 부모로 전달
  };
  return (
    <div>
      <Search
        placeholder="input search text"
        onChange={searchHandler}
        style={{ width: 200 }}
        value={searchTerm}
      />
    </div>
  );
};

export default SearchFeature;
