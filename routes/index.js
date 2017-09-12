var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
mongoose.Promise = Promise;
app.use(bodyParser.urlencoded({extended: true}));
//dbconnect
mongoose.connect("mongodb://localhost/test", { useMongoClient: true });

var userSchema=new mongoose.Schema({
  fname: String,
  lname: String,
  email: String,
  phoneNumber: Number,
  dob: String,
  password: String,
  regDate: String
});

var User = mongoose.model("User", userSchema);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/signup",function(req,res){
	res.render("signup");
});

router.get("/signin", function(req,res){
	res.render("signin");
});

router.post("/register",function(req,res){

  var fname=req.body.fname;
  var lname=req.body.lname;
  var email=req.body.email;
  var phoneNumber=req.body.phoneNumber;
  var dob=req.body.dob;
  var password=req.body.password;
  var cnfrmPassword=req.body.confirmPassword;
  var regDate=new Date();

  var addUser=new User();
    addUser.fname = fname,
    addUser.lname=lname;
    addUser.email = email,
    addUser.phoneNumber=phoneNumber,
    addUser.dob= dob,
    addUser.password= password,
    addUser.regDate= regDate

  addUser.save(function(err,user){
    if(err){
      console.log(err);
      res.send("Some Error Occured");
    }
    else{
      if(password==cnfrmPassword){
        console.log("User was inserted in the database");
  			console.log(user);
        res.redirect("/signin");
      }
      else{
        res.send("Passwords does not match");
      }
    }

  });

});

router.post("/login",function(req,res){
  var dbpass;
	var email = req.body.email;
	var password = req.body.password;
	console.log(email);
	console.log(password);
	User.findOne({ email: email }, function(err, user){
		if(err){
			console.log("Problem with database search");
		}
		if(!user){
			console.log("No user found. Signup required");
			res.redirect("/signup");
		}
		else{
			console.log("password found!");
			console.log(user.password);
			dbpass = user.password;
			if(dbpass == password){
			res.redirect("/welcome/"+email);
			} else{
				console.log("password is incorrect. Please sign in again");
				res.redirect("/signin");
			}
		}
});
});

router.get("/welcome/:email" ,function (req,res) {
  var email = req.params.email;
	var fname,lname, email,phoneNumber,dob, password, regisdate;
	User.findOne({email: email}, function(err, user){
		if(err){
			console.log("Fetching error. Please check if MongoDB is running or not.");
		}
		else{
			console.log("Data found!");
			fname = user.fname;
			lname = user.lname;
			email = user.email;
			phoneNumber = user.phoneNumber;
			dob = user.dob;
			password = user.password;
			regDate = user.regDate;
      res.render("welcome",{user:{fname:fname,lname: lname,email:email,phoneNumber:phoneNumber,dob:dob,password:password,regDate:regDate}});
			//res.render("home", {name:name, uname:uname, email:email, pass:password, bday:bday, bmonth:bmonth, byear:byear, regdate:regisdate});
		}
	});

});


module.exports = router;
