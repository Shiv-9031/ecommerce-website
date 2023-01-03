import Order from "../model/orderSchema.mjs";
import Product from "../model/ProductSchema.mjs"
import CatchAsyncError from "../middleware/CatchAsyncError.mjs";
import ErrorHandler from "../utils/ErrorHandler.mjs";

export const newOrder=CatchAsyncError(async (req,res,next)=>{
    const { shipingInfo,orderItems,paymentInfo,itemPrice,taxPrice,totalPrice,shipingPrice}=req.body;
    

    const order=await Order.create({
        shipingInfo, 
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        totalPrice,
        shipingPrice,
         
         paidAt:Date.now(),
         user:req.user._id
    })
    
    
    res.status(201).json({
        success:true,
        order
    })
})

//get single order

export const getSingleOrder=CatchAsyncError(async (req,res,next)=>{

    const order=await Order.findById(req.params.id).populate('user','name email');

    if(!order)
    {
        return next(new ErrorHandler(`order not found with this id :${req.params.id}`,404));
    }

    res.status(200).json({
        success:true,
        order
    })
})

//get loggedUser order

export const myOrder=CatchAsyncError(async (req,res,next)=>{

    const orders=await Order.find({user:req.user._id})


    res.status(200).json({
        success:true,
        orders
    })
})


//get all product order---Admin

export const getAllProduct=CatchAsyncError(async (req,res,next)=>{

    const orders=await Order.find();

    let total=0;
     orders.forEach(order => {
        total+=order.totalPrice;
    });


    res.status(200).json({
        success:true,
        orders,
        total
    })
})

//get update product order---Admin

export const updateAllProduct=CatchAsyncError(async (req,res,next)=>{

    const order=await Order.findById(req.params.id);


    if(!order)
    {
        return next(new ErrorHandler(`order not found with this id :${req.params.id}`,404));
    }
    
    if(order.orderStatus==="Delivered")
    {
        return(next(new ErrorHandler("You have deliverd this product",404)));
    }

     order.orderItems.forEach(async (o)=>{
           await updateStock(o.product,o.quantity);
        });

    order.orderStatus=req.body.status;
    if(order.orderStatus==="Delivered")
    {
        order.deliveredAt=Date.now();
    }
    

    await order.save({validatebeforesave:false});
    

    res.status(200).json({
        success:true,
        
    })
})

async function updateStock(id,quantity)
{
    const product=await Product.findById(id);
    product.stock-=quantity;

    await product.save({validateBeforeSave:false});
}
// delete order product--Admin
export const deleteOrderProduct=CatchAsyncError(async (req,res,next)=>{

    const order=await Order.findById(req.params.id);

    if(!order)
    {
        return next(new ErrorHandler(`order not found with this id :${req.params.id}`,404));
    }
    
    await order.remove();
    res.status(200).json({
        success:true,
        
      
    })
})
