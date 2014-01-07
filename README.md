FormMailer Service [![Build Status](https://travis-ci.org/abbr/FormMailerService.png)](https://travis-ci.org/abbr/FormMailerService) [![NPM version](https://badge.fury.io/js/form-mailer-service.png)](http://badge.fury.io/js/form-mailer-service) [![Dependency Status](https://gemnasium.com/abbr/FormMailerService.png)](https://gemnasium.com/abbr/FormMailerService)
=================
## About 
*FormMailer* is a service application emailing simple forms posted by users of a registered web site, freeing webmasters from the burden to write server-side scripts to implement email dispatching. By *simple form* I mean form data that can be represented in terms of name-value pairs of strings such as typical feedback or contact forms.

The following steps briefly describe the workflow using *FormMailer Service*:

1. A *FormMailer Service* administrator (a.k.a. SuperAdmin) creates an account for webmaster to grant using the service.
2. Webmaster registers his sites/forms with *FormMailer Service*. In return *FormMailer Service* generates a URL that webmaster uses to post the form.
3. Webmaster designs the form in his web site, and uses the URL in previous step to submit the form.
4. Webmaster also designs a success/failure page or message box in his site to handle the completion of form submission.

## Features

Form handling:

1. Both x-domain Ajax and plain HTML &lt;form&gt; submission
2. [reCAPTCHA](http://www.google.com/recaptcha)
3. multiple email transports: SMTP, Amazon SES, Sendmail and Direct

Administration:

1. Supports SSO, basic and login form based authentication
2. multiple administrators per site form
3. mobile friendly
4. No need to refresh browser (F5) any more!  - changes made by other administrators are pushed from server to browser automatically thanks to [Socket.IO](http://socket.io/)

Architecture:

Supports file or MongoDB as data repository. File is ideal for single server hosting. With replication-enabled MongoDB as data repo, a [shared-nothing architecture](http://en.wikipedia.org/wiki/Shared_nothing_architecture) can be achieved to build geographically redundant highly available web service.

## Live Demo
Administration site is available at [Heroku](http://pacific-reaches-9909.herokuapp.com/). Login as `admin/admin`. Demo site is slightly customized to protect `admin` account. Data is reset daily.

## Production Installation
1. Install [Node.js](http://nodejs.org/).
2. Download and expand *FormMailer-service.zip* from latest [release](https://github.com/abbr/FormMailerService/releases).
3. Set environment variable *NODE_ENV* to production.
4. Go to expanded FormMailer-service directory and run `npm install`.
5. Run `node server.js` to launch application.
6. Go to [http://localhost:3000](http://localhost:3000) to access the admin site. Login as admin/admin.
7. To change port, either modifing file */server.js* or set env *PORT* before launching *node*.
8. Change [Configurations](#configurations).
9. Running *Node* as a service or setting up a front-end reverse proxy are beyond the scope of this document. It's easy to google a solution.


## Developer Installation
1. Install [Ruby](http://www.ruby-lang.org/en/downloads/).
2. Install [Compass](http://compass-style.org/install/) by running `gem update --system;gem install compass`.
3. Install [Node.js](http://nodejs.org/).
4. Run `npm install -g yo` to intall [Yeoman](http://yeoman.io/).
5. Clone git repo from [https://github.com/abbr/FormMailerService.git](https://github.com/abbr/FormMailerService.git). Alternatively, create/go to the folder where you want to install the application and  Run `npm install form-mailer-service`. The application will be downloaded to subfolder *node_modules/form-mailer-service*. Move subfolder *form-mailer-service* to the final location and rename folder if need. 
6. Go to application root and run `npm install`, followed by `bower install`.
7. Launch the application in development mode by running `grunt serve`. To launch in production mode, run `grunt serve:dist`.
8. The launcher will open [http://localhost:9000](http://localhost:9000). Log in as admin/admin.
9. To stop, enter *Ctrl-C* twice.
10. Change [Configurations](#configurations).

## Configurations
Following configs are defined in */data/system.json* and requires restarting *Node* for changes to take effect:

1. *emailTransport* defines email settings. *FormMailer* uses [Nodemailer](https://github.com/andris9/Nodemailer) to send email. For supported email transports and corresponding settings, see [Nodemailer Readme](https://github.com/andris9/Nodemailer#possible-transport-methods). Only Direct and SMTP transports have been tested. 
2. *authenticationSchemes* defines authentication schemes for *FormMailer Service Administration* site. Supported authentication schemes are SSO (a.k.a reverse-proxy), form and basic. SSO can be chained to form or basic authentication to use them as fallback, thus *authenticationSchemes* is an array. When using SSO, the HTTP header name containing authenticated user name is defined in property *userHeader*. Unlike form or basic authentication, SSO doesn't use application defined password. However, it requires *userHeader* value matching one of the registered user names for authorization.  
3. *repository* defines data repository types. Supported *types* are *file* and *mongodb*. For *mongodb*, supply [connection string](http://docs.mongodb.org/manual/reference/connection-string/) in property *connection_string* and [connection options](http://mongoosejs.com/docs/connections.html#options) in *connection_options*.

## More Documentations
See [wiki](https://github.com/abbr/FormMailerService/wiki)

## License
[MIT](http://opensource.org/licenses/MIT)

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/abbr/formmailerservice/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

