import React, { useEffect, useState } from "react";
import { FaCode } from "react-icons/fa";
import { Icon, Card, Col, Row } from "antd";
import axios from "axios";
import Meta from "antd/lib/card/Meta";
import ImageSlider from "../../utils/ImageSlider";
import CheckBox from "./Sections/CheckBox";
import { continents } from "./Sections/Datas";

function LandingPage() {
  const [products, setProducts] = useState([]);
  const [skip, setSkip] = useState(0); // 몽고DB skip함수를 위함
  const [limit, setLimit] = useState(8); // 몽고DB limit함수를 위함
  const [postSize, setPostSize] = useState(0);

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
        <Card cover={<ImageSlider images={product.images} />}>
          <Meta title={product.title} description={`${product.price}`} />
        </Card>
      </Col>
    );
  });

  const handleFilters = () => {};

  return (
    <div style={{ width: "75%", margin: "3rem auto" }}>
      <div style={{ textAlign: "center" }}>
        <h2>
          Let's Travel Anywhere <Icon type="rocket" />
        </h2>
      </div>
      {/* Filter */}

      {/* CheckBox */}
      <CheckBox
        list={continents}
        handleFilters={(filter) => handleFilters(fiilters, "continents")}
      />

      {/* RadioBox */}

      {/* Search */}

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
