import{Schema,model} from 'mongoose';

const productModel = new Schema({
    name:{
        type:String,
        required:[true,'please enter product name'],
        trim:true
    },
    description:{
        type:String,
        required:[true,'please enter product description'],
    },
    category:{
        type:String,
        required:[true,'please enter product name'],
        
    },
    price:{
        type:Number,
        required:[true,'please enter product price'],
        maxlength:[8,'price cannot exceed 8 character'],
    },
    ratings:{
        type:Number,
        default:0
    },
    images:[
        {
            public_id:{
                type:String,
                required:true,
            },
            url:{
                type:String,
                required:true,
            }

        }
    ],
    stock:{
        type:Number,
        required:[true,'please enter the product stock'],
        maxlength:[4,'stock cannot exceed 4 character'],
        default:1
    },
    no_of_Reviews:{
        type:Number,
        default:0,
    },
    reviews:[
        {
            user: {
                type: Schema.ObjectId,
                required: false,
                ref: "user",
              },
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true,
            },
            comment:{
                type:String,
                required:true,
            }
        }
    ],
    createAt:{
        type:Date,
        default:Date.now
    }

})

export default model("product",productModel);