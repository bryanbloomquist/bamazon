console.log('This Is Loaded');

exports.mySQL = {
    id: process.env.MYSQL_USER,
    secret: process.env.MYSQL_PASSWORD
};