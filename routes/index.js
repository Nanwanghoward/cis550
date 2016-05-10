var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var current_user;
var login_response;


var multer = require('multer'),
    bodyParser = require('body-parser'),
    path = require('path');
router.use(bodyParser.json());


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/userlist', function (req, res) {
    var MongoClient = mongodb.MongoClient;
    var url = 'mongodb://dingz:cis550@ds021731.mlab.com:21731/550project';
    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log('Unable to connect to the server', err);
        } else {
            console.log("Connection Established");
            var collection = db.collection('users');
            collection.find({}).toArray(function (err, result) {
                if (err) {
                    res.send(err);
                } else if (result.length) {
                    res.render('userlist', {
                        "userlist": result
                    });
                } else {
                    res.send('No documents found');
                }
                db.close();
            });
        }
    });
});
router.get('/userprofile', function (req, res) {
    var MongoClient = mongodb.MongoClient;
    var url = 'mongodb://dingz:cis550@ds021731.mlab.com:21731/550project';
    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log('Unable to connect to the server', err);
        } else {
            console.log("Connection Established");
            var collection1 = db.collection(current_user.username);
            var collection2 = db.collection('users');
            collection2.find({
                username: current_user.username,
                password: current_user.password
            }).toArray(function (err, result) {
                if (err) {
                    res.send(err);
                } else if (result.length) {
                    res.render('userprofile', {
                        "profilelist": result,
                        title: 'RealtyHub.com',
                        username: current_user.username,
                        password: current_user.password,
                        email: current_user.email,
                        street: current_user.street,
                        city: current_user.city,
                        state: current_user.state
                    });
                } else {
                    res.send('No documents found');
                }
                db.close();
            });
        }
    });
});

router.get('/newuser', function (req, res) {
    res.render('newuser', {title: 'RealtyHub.com'});
});

router.get('/home', function (req, res) {
    res.render('home', {title: 'RealtyHub.com', response: login_response});
});

router.get('/signin', function (req, res) {
    res.render('signin', {title: 'RealtyHub.com', response: login_response});
    login_response = '';
});


router.post('/login', function (req, res) {
    console.log("...");
    var MongoClient = mongodb.MongoClient;
    var url = 'mongodb://dingz:cis550@ds021731.mlab.com:21731/550project';
    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log("Unable to connect to server", err);
        } else {
            console.log('Connected to server');
            var collection = db.collection('users');
            current_user = {username: req.body.username, password: req.body.password};
        }

        collection.find({
            username: current_user.username,
            password: current_user.password
        }).toArray(function (err, result) {
            if (err) {
                console.log(err);
            }
            else if (result.length) {
                current_user = result[0];
                console.log(current_user);
                res.redirect("userprofile");
            }

            else {
                console.log("wrong name or password");
                login_response = 'wrong name or password';
                res.redirect("signin");
            }

            db.close();
        });
    })
});

router.post('/adduser', function (req, res) {
    var MongoClient = mongodb.MongoClient;
    var url = 'mongodb://dingz:cis550@ds021731.mlab.com:21731/550project';
    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log("Unable to connect to server", err);
        } else {
            console.log('Connected to server');
            var collection = db.collection('users');
            current_user = {
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
                street: req.body.street,
                city: req.body.city,
                state: req.body.state
            };
        }
        collection.insert([current_user], function (err, result) {
            if (err) {
                console.log(err);
            } else {
                res.redirect("userprofile");
            }
            db.close();
        });
    })
});


// router.post('/result', function (req, res) {
//     var MongoClient = mongodb.MongoClient;
//     var url = 'mongodb://dingz:cis550@ds021731.mlab.com:21731/550project';
//     MongoClient.connect(url, function (err, db) {
//         if (err) {
//             console.log("Unable to connect to server", err);
//         } else {
//             console.log('Connected to server');
//             var collection1 = db.collection('WordTable');
//             // var collection2 = db.collection('LinkTable');
//             // var collection3 = db.collection('NodeTable');
//             // var query = {key_one: req.body.key_one};
//         }
//         db.close();
//
//         collection1.find({}).toArray(function (err, result1) {
//             if (err) {
//                 console.log(err);
//             }
//             else if (result.length) {
//                 var wordtable = result1[0]
//                 console.log(result1[0]);
//                     var pathes = [];
//                     var path = [];
//                     var temp = result[0].index;
//                     var index_seprate = temp.split("&");
//                     for (var i = 1; i < index_seprate.length; i++){
//                          collection3.find({id: index_seprate[i]}).toArray(function (err, result1) {
//                              console.log('bbb');
//                             if (err) {
//                                 console.log(err);
//                             }
//                             else if (result1.length) {
//                                 console.log('...');
//                                 var id = result1[0].parentID;
//                                 while (id != -1) {
//                                     console.log(result1[0]);
//                                     //path.push({key: result[0].key, value: result[0].value})
//                                     // find_path({id: id});
//                                 }
//                             }
//             }
//            // db.close();
//         });
//     });
//         //pathes.push(path);
//         var MongoClient = mongodb.MongoClient;
//         var url = 'mongodb://dingz:cis550@ds021731.mlab.com:21731/550project';
//         MongoClient.connect(url, function (err, db) {
//             if (err) {
//                 console.log("Unable to connect to server", err);
//             } else {
//                 console.log('Connected to server');
//                 var collection2 = db.collection('LinkTable');
//             }
//             collection2.find({}).toArray(function (err, result2) {
//                 if (err) {
//                     console.log(err);
//                 }
//                 else if (result.length) {
//                     var linktable = result2[0]
//                 }
//             });
//            
//             console.log(result2[0]);
//             db.close();
//             // });
//
//         });
//     });
//
//
//              //db.close();



router.post('/uploaded', multer({dest: './uploads/'}).single('upl'), function (req, res) {
    console.log(req.body); //form fields
    console.log("file is uploaded.")
    /* example output:
     { title: 'abc' }
     */
    console.log(req.file); //form files
    /* example output:
     { fieldname: 'upl',
     originalname: 'grumpy.png',
     encoding: '7bit',
     mimetype: 'image/png',
     destination: './uploads/',
     filename: '436ec561793aa4dc475a88e84776b1b9',
     path: 'uploads/436ec561793aa4dc475a88e84776b1b9',
     size: 277056 }
     */
    res.status(204).end();
});

router.get('/result', function (req, res) {
    var MongoClient = mongodb.MongoClient;
    var url = 'mongodb://dingz:cis550@ds021731.mlab.com:21731/550project';
    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log("Unable to connect to server", err);
        } else {
            console.log('Connected to server');
            var collection = db.collection('QueryTable');
        }
        collection.find({
            _id: "123"
        }).toArray(function (err, result) {
            if (err) {
                console.log(err);
            }
            else if (result.length) {
                console.log(result[0]);
                var result = result[0];
                var jsonStr = JSON.stringify(result);
                var jsonarray = jsonStr.replace(/:/gi,"-->");
                res.render('result', {title: 'RealtyHub.com',result:jsonarray})
            }
            db.close();
        });
    });
});

module.exports = router;
