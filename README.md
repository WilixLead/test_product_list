# test_product_list
Test Project for show my experince in Node.js and Angular development

## Installing
Just write in console commands:
```bash
git clone https://github.com/WilixLead/test_product_list.git
cd test_product_list
npm install
```

## Run
Before run this project, make shure you hame runned MongoDB server and script can access to database with localhost exception.
Or just change db configuration in ``config.js`` file.
Now for run application just type in command line:
```bash
node app.js
```
In some OS you should type
```bash
nodejs app.js
```
Now you can try to open next url in your browser:
http://localhost:3000/

## Testing
Make shure you have runned application.
Open command line, goto project directory and type:
```bash
mocha tests/user.api.test.js
```
For test users api
```bash
mocha tests/product.api.test.js
```
For test products api

Enjoy! :)
