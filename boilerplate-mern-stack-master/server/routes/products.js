const express = require("express");
const router = express.Router();
const multer = require("multer");
const { Product } = require("../models/Product");

//=================================
//             Product
//=================================

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // 파일 저장 위치
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`); // 파일을 어떤 이름으로 저장할지
  },
});

const upload = multer({ storage: storage }).single("file");

router.post("/image", (req, res) => {
  // 가져온 이미지를 저장
  upload(req, res, (err) => {
    if (err) {
      return req.json({ success: false, err });
    }

    return res.json({
      success: true,
      filePath: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});

router.post("/", (req, res) => {
  // 받아온 정보를 DB에 저장
  const product = new Product(req.body);

  product.save((err) => {
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

router.post("/products", (req, res) => {
  // product collection에 들어 있는 모든 상품 가져오기
  let skip = req.body.skip ? parseInt(req.body.skip) : 0; // 0번째부터
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;

  Product.find()
    .populate("writer") // 이 사람에 대한 정보 가져오기 (DB에서 writer의 정보)
    .skip(skip) // (몽고DB 함수) skip부터 (어디서부터 데이터를 가져오는지에 대한 위치)
    .limit(limit) // (몽고DB 함수) limit 개수만큼 가져오기 (처음 데이터를 가져올때와 더보기 버튼을 눌러서 가져올 때 얼마나 많은 데이터를 한번에 가져오는지)
    .exec((err, productInfo) => {
      if (err) return res.status(400).json({ success: false, err });
      return res
        .status(200)
        .json({ success: true, productInfo, postSize: productInfo.length });
    });
});

module.exports = router;
