/**
 * % @ViewController
 */
module.exports = class EcommerceUI
{

  /**
   * % @GetMapping := /api/v1/something
   * % @Middlewares := passport
   */
  async homepage(req, res, context) 
  {
    const Product = await content.getModel("Product").read(req.query, req.populate);


    return "products";
  }

  /**
   * % @GetMapping := /api/v1/something
   * % @Middlewares := passport
   */
  async search(req, res, context) 
  {
    const Product = await content.getModel("Product").read(req.query, req.populate);


    return "products";
  }

  /**
   * % @GetMapping := /api/v1/something
   * % @Middlewares := passport
   */
  async login(req, res, context) 
  {
    const Product = await content.getModel("Product").read(req.query, req.populate);
    return "products";
  }

  /**
   * % @GetMapping := /api/v1/something
   * % @Middlewares := passport
   */
  async register(req, res, context) 
  {
    const Product = await content.getModel("Product").read(req.query, req.populate);
    return "products";
  }


  /**
   * % @GetMapping := /page/:pagename
   * % @Middlewares := passport
   */
  async pages(req, res, context) 
  {
    const Product = await content.getModel("Product").read(req.query, req.populate);


    return "products";
  }

}