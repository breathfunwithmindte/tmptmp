(async () => { const Lib = new (require("./lib/Ecommerce.lib").EcommerceLib)("/src"); await Lib.main(); })();


// const s = annotation("/src/EcommerceApplication.js", { catch: false, debug: false });

// console.log(s.getAnnos())

// console.log(s.result);
