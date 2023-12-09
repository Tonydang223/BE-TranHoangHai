const CateM = require("../model/categories.model");

class Categories {
  async createCategory(req, res, next) {
    try {
      const { content, type } = req.body;
      const cate = await CateM.findOne({ content });

      if (cate)
        return res.status(409).json({ msg: "The category was existed !" });

      const catNew = await CateM({
        content,
        type,
      });

      const data = await catNew.save();

      return res.status(200).json({ msg: "The category was saved !", data });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }
  async editCategory(req, res, next) {
    try {
      const data = await CateM.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { ...req.body } },
        { new: true }
      );
      return res.status(200).json({ msg: "The category was updated !", data });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }

  async getAllCategory(req, res, next) {
    try {
      const data = await CateM.find().sort('-createdAt');
      return res.status(200).json({ msg: "The category was get all !", data });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }
}

module.exports = new Categories();
