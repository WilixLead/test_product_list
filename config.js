/**
 * Created by Aloyan Dmitry on 08.10.2015
 */
if( !process.env.NODE_ENV ) {
    process.env.NODE_ENV = 'production';
    module.exports = {
        port: 3000,
        secret: 'mySuperSecret',
        database: 'mongodb://192.168.11.128:27017/testprodlist'
    }
}

if( process.env.NODE_ENV == 'development' ) {
    module.exports = {
        port: 3000,
        secret: 'mySuperSecret',
        database: 'mongodb://192.168.11.128:27017/testprodlist'
    }
} 