export default class ApiSearchFeature {
  constructor(query, querystr) {
    this.query = query;
    this.querystr = querystr;
  }

  search() {
    
    const keyword = this.querystr.keyword
      ? {
          name: {
            $regex: this.querystr.keyword,
            $options: "i",
          },
        }
      : {};
      
    this.query = this.query.find({ ...keyword });
   
    return this;
  }
  filter() {
    const queryCopy = { ...this.querystr };
    //removing some fields
    const removeField = ["keyword", "page", "limit","description"];
    removeField.forEach((key) => delete queryCopy[key]);

    //filter for rating and price
    let querystr=JSON.stringify(queryCopy);
    console.log(querystr);
    querystr=querystr.replace(/\b(gt|gte|lt|lte)\b/g,key=>`$${key}`);
    console.log(querystr);
    this.query=this.query.find(JSON.parse(querystr));
    return this;
  }
  //pagination i.e., product shown per page

  pagination(resultPerpage)
  {
    const current_page=Number(this.querystr.page)||1;
    const skip_page=resultPerpage*(current_page-1);
    this.query=this.query.limit(resultPerpage).skip(skip_page);
    return this;
  }
}
