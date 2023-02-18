var ERRORTypes = {
  "MISSING_APPLICATION_CLASS": { 
    Name: "MISSING_APPLICATION_CLASS", 
    Description: "Class that extends EcommerceLib is required class.",
    Guide: "Create a file <MyFile.js>, add inside a class that extends EcommerceLib.Application and on the top of that class, add a annotation @EcommerceApplication." 
  },
  "MISSING_EXTEND": { 
    Name: "MISSING_EXTEND", 
    Description: "Current class should extend a lib static class.",
    Guide: "Read documetation to find the correct matching of class and their extends." 
  }
}

module.exports = {
  ERRORTypes
}