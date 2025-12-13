import { Input, InputGroup, InputLeftElement } from "@chakra-ui/input";
import React, { useState } from "react";
import { MdSearch } from "react-icons/md";

const Searchnav = ({ history }) => {
  const [keyword, setkeyword] = useState("");

  const Handlesearch = (e) => {
    // Check if the Enter key is pressed and the keyword is not empty
    if (keyword.trim() && e.key === "Enter") {
      // Redirect to the search page with the keyword in the URL
      history.push(`/search?keyword=${keyword}`);
    }
  };
  return (
    <InputGroup className="search-input-group">
      <InputLeftElement pointerEvents="none">
        <MdSearch className="search-icon" />
      </InputLeftElement>
      <Input
        value={keyword}
        onChange={(e) => setkeyword(e.target.value)}
        onKeyPress={Handlesearch}
        placeholder="Search for products, brands or more"
        className="search-input"
      />
    </InputGroup>
  );
};

export default Searchnav;
