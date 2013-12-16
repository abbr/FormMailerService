FormMailer Service
=================
## About## 
*FormMailer* is a service application emailing simple forms such as feedbacks or contacts posted by users from a registered web site, freeing webmasters from the burden to write server-side scripts to implement email dispatching. By *simple form* I mean form data can be represented by name-value pair of strings. 

The following steps briefly describe the workflow using *FormMailer Service*:
1. A *FormMailer Service* administrator (a.k.a. SuperAdmin) creates an account for webmaster to grant using the service.
2. Webmaster registers his sites/forms with *FormMailer Service*. In return *FormMailer Service* generates an URL that webmaster uses to the post form.
3. Webmaster designs the form in his web site, and uses the URL in previous step to submit the form.
4. Webmaster also designs a success/failure page or message box to handle the completion of form submission.

## Installation
1. Install [Ruby](http://www.ruby-lang.org/en/downloads/)
2. Install [Compass](http://compass-style.org/install/)
3. Install [Node.js](http://nodejs.org/)
4. Run `npm install -g yo` to intall [Yeoman](http://yeoman.io/)
5. Create/Go to the folder where you want to install the application and  Run `npm install form-mailer-service`. The application will be download to subfolder *node_modules/form-mailer-service*. Move subfolder *form-mailer-service* to the final location and rename folder if need. 
6. `cd form-mailer-service` and run `node install`, followed by `bower install`
7. Launch the application in development mode by running `grunt serve`. To launch in production mode, run `grunt serve:dist`.
7. The launcher will open http://localhost:9000. Log in using admin as user name and password.

## Current Limitations
1. Clustering is not supported due to in-memory caching