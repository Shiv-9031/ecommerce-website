import Product from "../model/ProductSchema.mjs";
import ErrorHandler from "../utils/ErrorHandler.mjs";
import CatchAsyncError from "../middleware/CatchAsyncError.mjs";
import ApiSearchFeature from "../utils/ApiSearchFeature.mjs";
//create product ---Admin

export const createProduct = CatchAsyncError(async (req, res, next) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

//get product
export const GetAllProduct = CatchAsyncError(async (req, res) => {
  const resultPerpage = 5;
  const product_count = await Product.countDocuments();
  const ApiSearch = new ApiSearchFeature(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerpage);

  const products = await ApiSearch.query;

  res.status(200).json({ success: true, products, product_count });
});
//get product detail

export const GetProductDetail = CatchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("product not Found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

//update product --Admin

export const updateProduct = CatchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("product not Found", 404));
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

// delete product----Admin

export const DeleteProduct = CatchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("product not Found", 404));
  }
  await product.remove();
  res.status(200).json({
    success: true,
    message: "product deleted",
  });
});

// create new review or update review

export const create_review = CatchAsyncError(async (req, res, next) => {
  const { comment, productId, rating } = req.body;

  const _review = {
    user: req.user._id,
    name: req.user.name,
   
    rating,
    comment,
  };

  const product=await Product.findById(productId);
 
  const isReviewed=product.reviews.find(rev=>rev.user.toString()==req.user._id.toString());
  
  if(isReviewed)
  {
    product.reviews.forEach(rev => {
      if(rev.user.toString==req.user._id.toString())
      {
        rev.rating=rating;
        rev.comment=comment;
      }
    });
  }
  else{
    product.reviews.push(_review);
    product.no_of_Reviews=product.reviews.length;
  }

  let avg=0;
  product.reviews.forEach(rev=>{avg+=rev.rating;});

  product.ratings=avg/product.reviews.length;

    
   await product.save({validatebeforesave:false});
    res.status(200).json({
      success:true
    })
});
