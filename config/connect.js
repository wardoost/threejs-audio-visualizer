var rewriteRulesSnippet = require("grunt-connect-rewrite/lib/utils").rewriteRequest;

module.exports = function(grunt, options){
  return {
    options: {
      port: 8000,
      hostname: '*',
      livereload: true,
    },
    build: {
      rules: [{
          from: '(^((?!css|html|js|img|fonts|\/$).)*$)',
          to: "$1.html"
        }],
      options: {
        base: 'build'
      }
    }
  }
};
