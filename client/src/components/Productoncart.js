// import { Image } from "@chakra-ui/image";
// import React, { useRef, useState, useEffect } from "react";
// import { Select } from "@chakra-ui/react";
// import { VscChromeClose } from "react-icons/vsc";
// import { addToCart, removeFromCart } from "../actions/cartActions";
// import { useDispatch } from "react-redux";
// import { Link } from "react-router-dom";

// const Productoncart = ({ product }) => {
//   const dispatch = useDispatch();

//   const [qty, setqty] = useState(0);
//   const select = useRef(null);
//   useEffect(() => {
//     console.log(product.images);
//     console.log("product details in productoncart Page", product);
//     return () => {};
//   }, []);

//   const optionvalue = () => {
//     setqty(parseInt(select.current.value));
//   };
//   const removeFromCartHandler = (id) => {
//     dispatch(removeFromCart(id));
//   };
//   return (
//     <div className="productcart">
//       <div className="imagecart">
//         <Image objectFit="cover" src={product.images[0]} />
//       </div>
//       <div>
//         <Link to={`/product/${product.product}`}>
//           <h2 className="productname">{product.name}</h2>
//         </Link>

//         <h2 className="priceproduct">Rs. {product.price}</h2>
//         <h2 className="sandh">sold and shiped by FedEx</h2>
//       </div>
//       <div className="qtyoption">
//         <Select
//           ref={select}
//           defaultValue={product.qty}
//           onChange={(e) =>
//             dispatch(addToCart(product.product, Number(e.target.value)))
//           }
//         >
//           {[...Array(product.countInStock).keys()].map((x) => (
//             <option value={x + 1}> {x + 1}</option>
//           ))}
//         </Select>
//         <h2>
//           {(qty === 0
//             ? product.qty * product.price
//             : qty * product.price
//           ).toFixed(2)}
//           Rs
//         </h2>
//       </div>
//       <VscChromeClose
//         className="deletecart"
//         size="26"
//         onClick={() => removeFromCartHandler(product.product)}
//       />
//     </div>
//   );
// };

// export default Productoncart;

import { Image } from "@chakra-ui/image";
import React, { useRef, useState, useEffect } from "react";
import { Select, Button } from "@chakra-ui/react";
import { VscChromeClose } from "react-icons/vsc";
import { addToCart, removeFromCart } from "../actions/cartActions";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const Productoncart = ({ product }) => {
  const dispatch = useDispatch();

  // State for quantity and selected size
  const [qty, setQty] = useState(product.qty || 1);
  const [selectedSize, setSelectedSize] = useState(
    product.size || product.productdetails?.sizes?.[0] || "XS"
  );

  const availableSizes = product.productdetails?.sizes || [];

  // Get stock for the selected size

  const stockBySize = product.productdetails?.stockBySize || [];

  const sizeStock =
    stockBySize.find((s) => s.size === selectedSize)?.stock || 0;

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  // Update cart when qty or size changes
  const updateCart = (newQty, size) => {
    setQty(newQty);
    setSelectedSize(size);
    dispatch(addToCart(product.product, newQty, size));
  };

  return (
    <div className="productcart">
      <div className="imagecart">
        <Image objectFit="cover" src={product.images[0]} />
      </div>

      <div>
        <Link to={`/product/${product.product}`}>
          <h2 className="productname">{product.name}</h2>
        </Link>
        <h2 className="priceproduct">Rs. {product.price}</h2>
        <h2 className="sandh">Sold and shipped by FedEx</h2>
      </div>

      <div className="qtyoption">
        {/* Size Selector */}
        <Select
          value={selectedSize}
          onChange={(e) => updateCart(qty, e.target.value)}
          w="100px"
        >
          {availableSizes.map((size) => (
            <option
              key={size}
              value={size}
              disabled={stockBySize.find((s) => s.size === size)?.stock === 0}
            >
              {size}{" "}
              {stockBySize.find((s) => s.size === size)?.stock === 0 &&
                "(Out of Stock)"}
            </option>
          ))}
        </Select>

        {/* Quantity Selector */}
        <Select
          value={qty}
          onChange={(e) => updateCart(Number(e.target.value), selectedSize)}
          w="60px"
        >
          {[...Array(sizeStock).keys()].map((x) => (
            <option key={x + 1} value={x + 1}>
              {x + 1}
            </option>
          ))}
        </Select>

        {/* Total Price */}
        <h2>{(qty * product.price).toFixed(2)} Rs</h2>
      </div>

      {/* Remove Button */}
      <VscChromeClose
        className="deletecart"
        size="26"
        onClick={() => removeFromCartHandler(product.product)}
      />
    </div>
  );
};

export default Productoncart;
