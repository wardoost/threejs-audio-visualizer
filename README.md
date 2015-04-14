#WebVR Boilerplate

A starting point for web-based VR experiences that work well in both Google Cardboard and Oculus Rift. Also provides a good fallback for experiencing the same content without requiring a VR device. Based on [borismus](https://github.com/borismus)' [WebVR Boilerplate](https://github.com/borismus/webvr-boilerplate).

*****

##Installation

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [getting started](http://gruntjs.com/getting-started) guide. Open terminal and install Grunt command line interface globally. You may need to use sudo.
```
npm install -g grunt-cli
```

Install Grunt Dependencies.
```
npm install
```

For the favicons generator task to work you need ImageMagick.
```
brew install imagemagick
```

Edit Gruntfile.js and the source files to your needs and run grunt.
```
grunt
```

*****

##Variables

###Gruntfile.js
- **deployDomain**: Your domain name without trailing slash nor subdomain. Site will be deployed to this server and domain will be used for absolute links
> oink.be
- **deploySubDir**: Subdirectory where your website will be uploaded to.
> deploy-sub-dir/
- **deployURL**: Url composed of deployDomain and deploySubDir.
> www.oink.be/deploy-sub-dir/

###example.jade (or other jade file)
- **websiteTitle**: Website title in title case. Derived from project directory name. Logically overwritten in base.jade.
> Static Site Generator
- **pageTitle**: Page title in title case. Derived from filename. Logically overwritten in example.jade.
> Example
- **fileName**: Filename of current page without extension. Do not overwrite.
> example
- **baseUrl**: Relative path with trailing slash. Add the flag 'absolute' to your Grunt command to have absolute paths in al html.
> ../
- **deploySubDir**: DeploySubDir as defined in Gruntfile.js.
> deploy-sub-dir/
- **deployUrl**: Url to website derived from deployDomain and deploySubDir in Gruntfile.js.
> http://www.oink.be/deploy-sub-dir/
- **absoluteUrl**: Absolute url to the current page based on deployUrl from gruntfile.js and filename.
> http://www.oink.be/deploy-sub-dir/example-dir/example
- **timeStamp**: Date of today, format: DD/MM/YYYY
> 09/04/2015

*****

##Commands

The default grunt command builds the site and starts a local server.
```
grunt
```

The grunt dev command builds the site and seo and starts a local server.
```
grunt dev
```

The grunt deploy command builds the site and seo and uploads the site with ftp. You need to create a .ftppass file in de root of the grunt project with authentification of your FTP server. More info on the [Grunt FTP deploy task GitHub page](https://github.com/zonak/grunt-ftp-deploy) about this.
```
grunt deploy
```

You can add the flag "absolute" to have absolute paths in your HTML. This is practically only useful when deploying the site.
```
grunt deploy --absolute
```

*****

##To do
- Make all error pages or create dynamic error page
- Modify .htaccess so www.yourwebsite.com, yourwebsite.com and yourwebsite.com/index lead all to the same page, better for SEO
- PJAXify forms like a contact form
- Fix Firefox font problems
- Fix connect task middleware rewrite rules so clean URL's work
- Divide uglify and less task in dev and deploy version
- Add logic to have a custom social sharing image per page