module.exports = function(eleventyConfig) {
  // Passthrough copy for CSS and JS
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  
  // Passthrough copy for CMS admin folder
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "layouts"
    }
  };
};
