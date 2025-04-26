const bcrypt = require('bcryptjs');
console.log(bcrypt.hashSync('admin123', 10));
console.log(bcrypt.hashSync('viewer123', 10));