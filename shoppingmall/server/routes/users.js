const express = require("express");
const router = express.Router();
const { User } = require("../models/User");

const { auth } = require("../middleware/auth");

//=================================
//             User
//=================================

router.get("/auth", auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

router.post("/register", (req, res) => {
  const user = new User(req.body);

  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

router.post("/login", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user)
      return res.json({
        loginSuccess: false,
        message: "Auth failed, email not found",
      });

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ loginSuccess: false, message: "Wrong password" });

      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        res.cookie("w_authExp", user.tokenExp);
        res.cookie("w_auth", user.token).status(200).json({
          loginSuccess: true,
          userId: user._id,
        });
      });
    });
  });
});

router.get("/logout", auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    { token: "", tokenExp: "" },
    (err, doc) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true,
      });
    }
  );
});

router.post("/addToCart", auth, (req, res) => {
  // 1. User Collection에 해당 유저의 정보를 가져오기
  // auth 미들웨어때문에 가능 (auth: 쿠키에 유저정보가 있고, req에 user정보가 들어가 있다.)
  User.findOne({ _id: req.user._id }, (err, userInfo) => {
    // 2. 가져온 정보에서 카트에다 넣으려 하는 상품이 이미 들어 있는지 확인
    let duplicate = false;
    userInfo.cart.forEach((item) => {
      if (item.id === req.body.productId) {
        duplicate = true;
      }

      if (duplicate) {
        // 2-1. 상품이 이미 있을 때
        User.findOneAndUpdate(
          {
            // 사람을 찾고, 그 사람안의 cart를 찾는다.
            _id: req.user._id,
            "cart.id": req.body.productId,
          },
          { $inc: { "cart.$.quantity": 1 } },
          { new: true }, // 업데이트된 유저 정보를 받기위해서 필요
          (err, userInfo) => {
            if (err) return res.status(200).json({ success: false, err });
            return res.status(200).send(userInfo.cart); // cart부분만 전달
          }
        );
      } else {
        // 2-2. 상품이 이미 없을 때
        User.findOneAndUpdate(
          { _id: req.user._id },
          {
            $push: {
              cart: {
                id: req.body.productId,
                quantity: 1,
                date: Date.now(),
              },
            },
          },
          { new: true },
          (err, userInfo) => {
            if (err) return res.status(200).json({ success: false, err });
            return res.status(200).send(userInfo.cart); // cart부분만 전달
          }
        );
      }
    });
  });
});

module.exports = router;
