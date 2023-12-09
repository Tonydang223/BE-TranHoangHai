const express = require("express");
const productController = require("../controller/product.controller");
const router = express.Router();
const authMid = require("../middleware/auth");
const verifyRole = require("../middleware/authRole");
const { ROLES } = require("../config/constants");
const upload = require("../config/multer");

router
  .route("/parts")
  .post(
    authMid.userGuard,
    verifyRole(ROLES[1]),
    productController.createProduct
  );
router.post(
  "/del",
  authMid.userGuard,
  verifyRole(ROLES[1]),
  productController.deleteProduct
);
router.post(
  "/del/restore",
  authMid.userGuard,
  verifyRole(ROLES[1]),
  productController.deleteProductRestore
);
router.post(
  "/del/restore/back",
  authMid.userGuard,
  verifyRole(ROLES[1]),
  productController.deleteProductRestoreBack
);
router.post(
  "/:id",
  authMid.userGuard,
  verifyRole(ROLES[1]),
  productController.editProduct
);
router.get("/all", productController.getAllProducts);
router.get("/:id", productController.getOneProduct);

module.exports = router;
