# Generic Invitation Page
An example of a social viral invitation page for a generic product.
# Description
This is a simple template for a generic invitation page with an email input text. 
An invitation mail will be sent to a user along with a confirmation link and a viral link to recommend the
product to other friends through social media widgets (Facebook & Twitter).
All data is stored in mongoDb with a simple friendly admin interface.


# Snapshots

### Frontpage

http://invitationpage.url

![alt tag](https://raw.github.com/daniel-costa-hk/invitationpage/master/public/images/snapshots/invitepage_frontpage.png)


### Admin

http://invitationpage.url/

![alt tag](https://raw.github.com/daniel-costa-hk/invitationpage/master/public/images/snapshots/invitepage_admin.png)


# Motivation
An example of integrating traditional marketing viral pages with new techkits.

# Installation

### Mac & Linux

Install [Node.JS](https://nodejs.org/) <br />
Install [Mongo.DB](https://www.mongodb.org/)
* (sudo) mongod 
* (sudo) node bin/preinstall.js
* (sudo) npm install -g nodemon
* nodemon app.js
* navigate to localhost:3000  (listening on port 3000 by default)

> You’re running! (If any issues, check the console for any errors.)

> The application will create a user collection on Mongo DB.
> Configure the settings in lib/config/development.json & lib/config/production.json


### Windows
Not really sure :_)

# License

GNU General Public License

# Tech Kit
MongoDB
Node.Js + Express + Jade
Jquery
