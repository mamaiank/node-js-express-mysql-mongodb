var express = require("express");
var router = express.Router();
const { check, validationResult } = require("express-validator");
const monk = require("monk");
const url = "localhost:27017/testing";
const db = monk(url);
const mysql = require("mysql");

const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "testing",
});

router.get("/", (req, res, next) => {
  res.render("product/product");
});

router.get("/add", (req, res, next) => {
  res.render("product/add");
});

router.post(
  "/add",
  [check("product", "Please Input Name").not().isEmpty()],
  [check("desc", "Please Input Desc").not().isEmpty()],
  [check("price", "Please Input Price").not().isEmpty()],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //   console.log(errors);
      res.render("product/add", { errors: errors.errors });
      //   return res.status(422).json({ errors: errors.array() });
    }
    sql =
      "INSERT INTO product (product_name, product_desc, product_price) values ('" +
      req.body.product +
      "', '" +
      req.body.desc +
      "', " +
      req.body.price +
      ")";
    conn.query(sql, (err, res) => {
      if (err) throw err;
      console.log("insert complete");
    });
    const collect = db.get("product");
    collect
      .insert({
        product_name: req.body.product,
        product_desc: req.body.desc,
        product_price: req.body.price,
      })
      .then((docs) => {
        console.log(docs);
        req.flash("info", "Success");
        res.render("product/add");
      })
      .catch((err) => {
        req.flash("error", "Failed");
        console.log(err);
      })
      .then(() => db.close());
  }
);

module.exports = router;
