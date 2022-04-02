import React, { useEffect, useState } from "react";
import { Icon, Card, Col, Row } from "antd";
import axios from "axios";
import Meta from "antd/lib/card/Meta";
import ImageSlider from "../../utils/ImageSlider";
import CheckBox from "./Sections/CheckBox";
import RadioBox from "./Sections/RadioBox";
import SearchFeature from "./Sections/SearchFeature";
import { continents, price } from "./Sections/Datas";

function LandingPage() {
  const [products, setProducts] = useState([]);
  const [skip, setSkip] = useState(0); // 몽고DB skip함수를 위함
  const [limit, setLimit] = useState(8); // 몽고DB limit함수를 위함
  const [postSize, setPostSize] = useState(0);
  const [filters, setFilters] = useState({
    continents: [],
    price: [],
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let body = {
      skip: skip,
      limit: limit,
    };

    getProducts(body);
  }, []);

  const getProducts = (body) => {
    axios.post("/api/products/products", body).then((response) => {
      if (response.data.success) {
        console.log(response.data);
        if (body.loadMore) {
          setProducts([...products, ...response.data.productInfo]);
        } else {
          setProducts(response.data.productInfo);
        }
        setPostSize(response.data.postSize);
      } else {
        alert("상품들을 가져오는데 실패했습니다.");
      }
    });
  };

  const loadMoreHandler = () => {
    let skipChange = skip + limit;
    let body = {
      skip: skipChange,
      limit: limit,
      loadMore: true,
    };

    getProducts(body);
    setSkip(skipChange);
  };

  const renderCards = products.map((product, index) => {
    return (
      <Col lg={6} md={8} xs={24} key={index}>
        <Card
          cover={
            <a href={`/product/${product._id}`}>
              <ImageSlider images={product.images} />
            </a>
          }
        >
          <Meta title={product.title} description={`${product.price}`} />
        </Card>
      </Col>
    );
  });

  const showFilterResults = (f) => {
    let body = {
      skip: 0,
      limit: limit,
      filters: f,
    };

    getProducts(body);
    setSkip(0);
  };
  const handlePrice = (value) => {
    const data = price; // price = Datas.price
    let array = [];

    for (let key in data) {
      if (data[key]._id == parseInt(value, 10)) {
        array = data[key].array;
      }
    }
    return array;
  };

  const handleFilters = (f, category) => {
    const newFilters = { ...filters };
    newFilters[category] = f;

    if (category === "price") {
      let priceValues = handlePrice(f);
      newFilters[category] = priceValues;
    }

    showFilterResults(newFilters);
    setFilters(newFilters);
  };

  const updateSearchTerm = (newSearchTerm) => {
    let body = {
      skip: 0,
      limit: limit,
      filters: filters,
      searchTerm: newSearchTerm,
    };

    setSkip(0);
    setSearchTerm(newSearchTerm);
    getProducts(body);
  };

  return (
    <div style={{ width: "75%", margin: "3rem auto" }}>
      <div style={{ textAlign: "center" }}>
        <h2>
          Let's Travel Anywhere <Icon type="rocket" />
        </h2>
      </div>
      {/* Filter */}
      <Row gutter={[16, 16]}>
        <Col lg={12} xs={24}>
          {/* CheckBox */}
          <CheckBox
            list={continents}
            handleFilters={(filters) => handleFilters(filters, "continents")}
          />
        </Col>
        <Col lg={12} xs={24}>
          {/* RadioBox */}
          <RadioBox
            list={price}
            handleFilters={(filters) => handleFilters(filters, "price")}
          />
        </Col>
      </Row>

      {/* Search */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          margin: "1rem auto",
        }}
      >
        <SearchFeature refreshFunction={updateSearchTerm} />
      </div>

      {/* Cards */}
      <Row gutter={[16, 16]}>{renderCards}</Row>

      {postSize >= limit && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button onClick={loadMoreHandler}>Load More</button>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
