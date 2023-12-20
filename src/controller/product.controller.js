const { uploads } = require("../config/cloudinary");
const ProductM = require("../model/product.model");
const CommentM = require("../model/comments.model");
const fs = require("fs");
const { TYPE_COMMENT } = require("../config/constants")

class Product {
  async createProduct(req, res, next) {
    try {
      // const { title, count, desc, discount, price, sizes, categories, code, sold } =
      //   req.body;
      const product = await ProductM.findOne({ title: req.body.title });
      if (product)
        return res
          .status(409)
          .json({ msg: "The product was already available !" });

      const savedProduct = new ProductM({
        ...req.body,
      });


      const data = await savedProduct.save();

      return res
        .status(200)
        .json({ msg: "The product was created successfully !" , data});
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }

  async editProduct(req, res, next) {
    try {

      const data = await ProductM.findByIdAndUpdate(
        { _id: req.params.id },
        {
          $set:  { ...req.body },
        },
        { new: true }
      );

      if(!data) return res.status(404).json({ msg: 'The product was not found!'});

      return res
        .status(200)
        .json({ msg: "The product has been updated successfully !", data });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }

  async getAllProducts(req, res, next) {
     try {
        const data = await ProductM.find().sort('-createdAt');
        res.status(200).json({ msg: 'Get all products successfully!', data });
     } catch (error) {
        return res.status(500).json({ msg: error.message });
     }
  }

  async getOneProduct(req, res, next) {
    try {
        const data = await ProductM.findOne({_id: req.params.id}).populate({
            path: "comment",
            populate: {
              path: "by_user likes",
              select: "-password",
            },
            options: { sort: { commentedAt: -1 } },
          });;
        if(!data) return res.status(404).json({ msg: 'The product not found !'})
        res.status(200).json({ msg: 'Get one product successfully!', data });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
  }

  async deleteProductRestore(req, res, next) {
    try {

      const dataDel = await ProductM.updateMany(
        {_id: {$in: req.body.ids}},
        {
          $set: {isDeleted: true}
        },
        {multi: true}
      )
      if(dataDel.modifiedCount < 1) {
        return res.status(400).json({msg: 'The id is not existed or delete failed !'});
      }
      res.status(200).json({msg: 'The products were deleted temporarily !'})
      
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }
  async deleteProductRestoreBack(req, res, next) {
    try {

      const dataDel = await ProductM.updateMany(
        {_id: {$in: req.body.ids}},
        {
          $set: {isDeleted: false}
        },
        {multi: true}
      )
      if(dataDel.modifiedCount < 1) {
        return res.status(400).json({msg: 'The id is not existed or delete failed !'});
      }
      res.status(200).json({msg: 'The products were deleted temporarily !'})
      
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }

  async deleteProduct(req, res, next) {
    try {
        const dataDel = await ProductM.deleteMany(
            { _id: {$in: req.body.ids} },
          );
        await CommentM.deleteMany({$and: [{type: TYPE_COMMENT[0]}, {product_id: {$in: req.body.ids}}]});
    
          if(dataDel.deletedCount < 1) {
            return res.status(400).json({msg: 'The id is not existed or delete failed !'});
          }
          return res.status(200).json({ msg: "The product was deleted !" });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
  }
}

module.exports = new Product();
