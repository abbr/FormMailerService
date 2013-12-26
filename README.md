FormMailer Service [![Build Status](https://travis-ci.org/abbr/FormMailerService.png)](https://travis-ci.org/abbr/FormMailerService) [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)
=================
## About 
*FormMailer* is a service application emailing simple forms posted by users of a registered web site, freeing webmasters from the burden to write server-side scripts to implement email dispatching. By *simple form* I mean form data that can be represented in terms of name-value pairs of strings such as typical feedback or contact forms.

The following steps briefly describe the workflow using *FormMailer Service*:

1. A *FormMailer Service* administrator (a.k.a. SuperAdmin) creates an account for webmaster to grant using the service.
2. Webmaster registers his sites/forms with *FormMailer Service*. In return *FormMailer Service* generates a URL that webmaster uses to post the form.
3. Webmaster designs the form in his web site, and uses the URL in previous step to submit the form.
4. Webmaster also designs a success/failure page or message box in his site to handle the completion of form submission.

## Production Installation
1. Install [Node.js](http://nodejs.org/)
2. Download and expand *FormMailer-service.zip* from a [release](https://github.com/abbr/FormMailerService/releases)
3. Set environment variable *NODE_ENV* to production
4. Go to expanded FormMailer-service directory and run `npm install`
5. Run `node server.js` to launch application
6. Go to [http://localhost:3000](http://localhost:3000) to access the admin site. Login as admin/admin
7. To change port, modify server.js
8. Change [Configurations](#configurations)
9. Running Node as a service or setting up a front-end reverse proxy are beyond the scope of this document. It's easy to google a solution.


## Developer Installation
1. Install [Ruby](http://www.ruby-lang.org/en/downloads/)
2. Install [Compass](http://compass-style.org/install/) by running `gem update --system;gem install compass`
3. Install [Node.js](http://nodejs.org/)
4. Run `npm install -g yo` to intall [Yeoman](http://yeoman.io/)
5. Clone git repo from [https://github.com/abbr/FormMailerService.git](https://github.com/abbr/FormMailerService.git). Alternatively, create/go to the folder where you want to install the application and  Run `npm install form-mailer-service`. The application will be downloaded to subfolder *node_modules/form-mailer-service*. Move subfolder *form-mailer-service* to the final location and rename folder if need. Alternatively, 
6. Go to application root and run `npm install`, followed by `bower install`
7. Launch the application in development mode by running `grunt serve`. To launch in production mode, run `grunt serve:dist`.
8. The launcher will open [http://localhost:9000](http://localhost:9000). Log in as admin/admin.
9. To stop, enter Ctrl-C twice.
10. Change [Configurations](#configurations)

## Configurations
1. Edit */data/system.json* to change 
	* SMTP server 
	* authentication schemes for *FormMailer Service Administration* site.
	* data repository
2. Restart Node.

## Current Limitations
1. Clustering is not supported due to in-memory caching. 

## More Documentations
See [wiki](https://github.com/abbr/FormMailerService/wiki)
