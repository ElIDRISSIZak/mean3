const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const assert = require('assert');

const parseString = require('xml2js').parseString;
const http = require('http');
var mongojs = require('mongojs');
var db = mongojs('mongodb://localhost:27017/mean', ['users']);

const xml2js = require('xml2js');

var cors = require('cors');

// Connect
const connection = (closure) => {
    return MongoClient.connect("mongodb://localhost:27017/mean", (err, db) => {
        if (err) return console.log(err);

        closure(db);
    });
};

// Error handling
const sendError = (err, res) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};

// Get users
router.get('/users', (req, res) => {
    connection((db) => {
        db.collection('users')
            .find()
            .toArray()
            .then((users) => {
                response.data = users;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});

// Get Tasks 
router.get('/tasks', (req, res) => {
    connection((db) => {
        db.collection('tasks')
            .find()
            .toArray()
            .then((tasks) => {
                response.data = tasks;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});

// find Task  by desc (modelisation)
router.get('/task', (req, res) => {
    connection((db) => {
        
        db.collection('tasks').find( { "desc": "modelisation" } )
        .each(function(err, doc) {
            assert.equal(err, null);
            if (doc != null) {
                console.dir(doc);
                 res.json(doc);
            }
            if(err)
            // } else {
                res.json("doc");
            // }
        });
    });

});

// find Task  by id
router.get('/task/:id', (req, res, next) => {
    connection((db) => {
        
        var cursor =db.collection('tasks').findOne( {_id : mongojs.ObjectID(req.params.id)}, function(err, task)  {
            if(err){
                res.send(err);
            }
            res.json(task);

        });
        

    });
});

//Auth test
router.post('/authen', cors(), (req, res, next) => {
    var user = req.body;
    if(!user){
        res.status(400);
        res.json({
            "error":"bad DATA"
        });
    }else{

        connection((db) => {
            db.collection('users').findOne(user, function (err, user) {
		if(err){
                res.send("error1");
            }
        if(user){
            res.json(user);
            console.log("user", user);
        }
        else{
            console.log("user", "null");
            res.json(null);            
        }
        /*else{
            res.status(400);
            res.json({
                "error":"bad DATA"
            });
        } */  
    
        });
        
    });
    }
        
});

//save Task
router.post('/task', (req, res, next) => {
    var task = req.body;
    if(!task.title || !task.desc){
        res.status(400);
        res.json({
            "error":"bad DATA"
        });
    }else{

        connection((db) => {
            
            var cursor =db.collection('tasks').save(task, function(err, task){
                if(err){
                    res.send(err);
                }
                
              
            });
            
    
        });
        res.json(task);
    }
    
        
});

// Delete Task  by id
router.delete('/task/:id', (req, res, next) => {
    connection((db) => {
        
        db.collection('tasks').remove( {_id : mongojs.ObjectID(req.params.id)}, function(err, task)  {
            if(err){
                res.send(err);
            }
            res.json(task);

        });
        

    });
});


// Get classifications from Database and display JSON format
router.get('/test2', (req, res) => {
    /*var fs = require('fs');
    fs.readFile('step-xml.xml', (err, data) => {
        if (err) throw err;
        var parser = new xml2js.Parser({ignoreAttrs: true});
        parser.parseString(data, function (err, result) {
        // parseString(data, function (err, result) {
            res.json(result);
            
          });
      });*/
      connection((db) => {
        db.collection('classifications')
            .find()
            .toArray()
            .then((classifications) => {
                response.data = classifications;
                res.json(response.data);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });

    });
    
    // Get ALL Classifications xml file and display JSON format
router.get('/test', (req, res) => {
    var fs = require('fs');
    fs.readFile('step-XML-V0.1.xml', (err, data) => {
        if (err) throw err;
        var parser = new xml2js.Parser({ attrkey: '@' });
    //    parser.parseString(data, function (err, result) {
         parseString(data, function (err, result) {
            res.json(result);
            
          });
      });

    });
// Get xml file and display JSON format
router.get('/test3', (req, res) => {
    var fs = require('fs');
    fs.readFile('step-xml.xml', (err, data) => {
        if (err) throw err;
        var parser = new xml2js.Parser({ attrkey: '@' });
    //    parser.parseString(data, function (err, result) {
         parseString(data, function (err, result) {
            res.json(result);
            
          });
      });

    });
      // Get xml file and display JSON format 
      // Insert JSON format in DataBase
router.get('/insertion', (req, res) => {
    var fs = require('fs');
    fs.readFile('step-XML-V0.1.xml', (err, data) => {
        if (err) throw err;
        // var json = JSON.parse(data);
        var parser = new xml2js.Parser({ attrkey: 'attribut' });
        parser.parseString(data, function (err, result) {
            // res.json(result);
            console.log("=>",result, "<=");
            var value = result['STEP-ProductInformation']['Classifications'];
            console.log(value);
        connection((db) => {
        db.collection('classifications').insert(value,{safe:true}, function(err, doc) {
            console.log(doc);
        if(err) throw err;
            res.json("file inserted ");
        });
        // res.json("file inserted ");
        // parseString(data, function (err, result) {
        //     // res.json(result);

        //     connection((db) => {
                
        //     var cursor =db.collection('classifications').save( res.json(result), function(err, task){
        //         if(err){
        //             res.send(err);
        //         }
        //         /*else{
        //             res.json("file inserted ");
                    
        //         }
                
              
        //     });
        // });
            
          });
        });
      });
    });

// Get xml file and display JSON format
/*router.get('/test', (req, res) => {
    var fs = require('fs');
    fs.readFile('blah.xml', (err, data) => {
        if (err) throw err;
        parseString(data, function (err, result) {
            res.json(result);
            
          });
      });*/

//Login
router.post('/testing', (req, res, next) => {
    var user = req.body;
    if(!user){
        res.status(400);
        res.json({
            "error":"bad DATA"
        });
    }else{

        connection((db) => {
            db.collection('users').findOne({ username: username, password: password }, function (err, user) {
		if(err){
                res.send(err);
            }
            res.json(user);
            
    
        });
        
    });
    }
        
});
      
      // get xml string and display JSON format

    // var xml2js = require('xml2js');
    // var xml = "<note><test><to>Tove</to><from>Jani</from><heading>Reminder</heading><body>Don't forget me this weekend!</body></test><test><to>Tove</to><from>Jani</from><heading>Reminder</heading><body>Don't forget me this weekend!</body></test></note>";
    // var extractedData = "";
    // var parser = new xml2js.Parser();
    // parser.parseString('blah.xml', function(err,result){

    //Extract the value from the data element
    // extractedData = result['config']['data'];
    // console.log(extractedData);
    
    // res.json(result);
   
    // console.log("Note that you can't use value here if parseString is async; extractedData=", extractedData);
    
// });
  

module.exports = router;
