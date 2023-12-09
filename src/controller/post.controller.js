
const PostM = require('../model/post.model')
class Post {
  async createPost(req, res, next) {
    try {
        const post = await PostM.findOne({ title: req.body.title });
        if (post)
          return res
            .status(409)
            .json({ msg: "The product was already available !" });
  
        const savedPost = new PostM({
          ...req.body,
        });
  
  
        const data = await savedPost.save();
  
        return res
          .status(200)
          .json({ msg: "The post was created successfully !" , data});
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
  }
  async editProduct(req, res, next) {
    try {
        const data = await PostM.findByIdAndUpdate(
            { _id: req.params.id },
            {
              $set:  { ...req.body },
            },
            { new: true }
          );
    
          if(!data) return res.status(404).json({ msg: 'The post was not found!'});
    
          return res
            .status(200)
            .json({ msg: "The post has been updated successfully !", data });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
  }
  async getAllPosts(req, res, next) {
    try {
       const data = await PostM.find().sort('-createdAt');
       res.status(200).json({ msg: 'Get all posts successfully!', data });
    } catch (error) {
       return res.status(500).json({ msg: error.message });
    }
 }

 async getOnePost(req, res, next) {
   try {
       const data = await PostM.findOne({_id: req.params.id})
       if(!data) return res.status(404).json({ msg: 'The post not found !'})
       res.status(200).json({ msg: 'Get one post successfully!', data });
   } catch (error) {
       return res.status(500).json({ msg: error.message });
   }
 }

 async deletePostRestore(req, res, next) {
    try {

      const dataDel = await PostM.updateMany(
        {_id: {$in: req.body.ids}},
        {
          $set: {isDeleted: true}
        },
        {multi: true}
      )
      if(dataDel.modifiedCount < 1) {
        return res.status(400).json({msg: 'The id is not existed or delete failed !'});
      }
      res.status(200).json({msg: 'The posts were deleted temporarily !'})
      
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }
  async deletePostRestoreBack(req, res, next) {
    try {

      const dataDel = await PostM.updateMany(
        {_id: {$in: req.body.ids}},
        {
          $set: {isDeleted: false}
        },
        {multi: true}
      )
      if(dataDel.modifiedCount < 1) {
        return res.status(400).json({msg: 'The id is not existed or delete failed !'});
      }
      res.status(200).json({msg: 'The posts were deleted temporarily !'})
      
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }

  async deletePost(req, res, next) {
    try {
        const dataDel = await PostM.deleteMany(
            { _id: {$in: req.body.ids} },
          );
    
          if(dataDel.deletedCount < 1) {
            return res.status(400).json({msg: 'The id is not existed or delete failed !'});
          }
          return res.status(200).json({ msg: "The post was deleted !" });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
  }

}

module.exports = new Post();