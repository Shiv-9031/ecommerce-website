import moongoose from "mongoose";

const OrderSchema = new moongoose.Schema({
  shipingInfo: {
    address: { 
        type: String, 
        required: true 
    },
    city: { 
        type: String, 
        required: true
     },
    state: { 
        type: String, 
        required: true 
    },
    country: { 
        type: String, 
        required: true, 
        default: "India"
     },
    pin_code: { 
        type: Number, 
        required: true 
    },
    phone_no: { 
        type: Number,
         required: true
        },
  },
  orderItems:[
   {
        name:{
            type:String,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        quantity:{
            type:Number,
            required:true
        },
        image:{
            type:String,
            required:true
        },
        product:{
            type:moongoose.Schema.ObjectId,
            ref:"product",
            required:true
        }
    }
],
  user:{
    type:moongoose.Schema.ObjectId,
    required:true,
    ref:"user"
  },
  paymentInfo:{
    id:{
        type:String,
        required:true
    
    },
    status:{
        type:String,
        required:true
    },
},
    paidAt:{
        type:Date,
        required:true
    },
    itemPrice:{
        type:Number,
        default:0
        ,required:true
    },
    taxPrice:{
        type:Number,
        default:0
        ,required:true
    },
    shippingPrice:{
        type:Number,
        default:0
        ,required:true
    },
    totalPrice:{
        type:Number,
        default:0
        ,required:true
    },
    orderStatus:{
        type:String,
        default:"processing"
    },
    deliveredAt:Date,
    createdAt:{
        type:Date,
        default:Date.now(),
    }

  }
);

export default moongoose.model('product_order',OrderSchema);
