const express = require('express');
const passport = require('passport');
const Account = require('../models/account');
const router = express.Router();
const http = require('http');
const request = require("request");
const path = require("path");




/*******************/
/* API for Root */
/*******************/
//Root Index
router.get('/', function (req, res) {
	if(!req.user){
		res.redirect('login');
	}else if(req.user.type === 'user'){

		var URL = "http://52.42.223.87:8080/jobseeker/"+req.user.username;
	    console.log(URL);
	    var ret_data;
	    request({
		  uri: URL,
		  method: "GET"
		}, function(error, response, body) {
		  	console.log(body);
		  	ret_data = JSON.parse(body);
		  	console.log(ret_data);

		  	if(ret_data.verified){
			  	if(ret_data.verified === 'T'){
					res.redirect('jobsearch');
				}else{ //ret_data.verified === 'F'
					res.render('verify', { 
						user : req.user ,
						page : 'verify'
					});

				}
			}
			res.render('verify', { 
				user : req.user ,
				page : 'verify'
			});
		});

	}else if(req.user.type === 'company'){

    	var URL = "http://52.42.223.87:8080/company/"+req.user.username;
	    console.log(URL);
	    var ret_data;
	    request({
		  uri: URL,
		  method: "GET"
		}, function(error, response, body) {
		  	console.log(body);
		  	ret_data = JSON.parse(body);
		  	console.log(ret_data);

		  	if(ret_data.verified){
			  	if(ret_data.verified === 'T'){
					res.redirect('mypost');
				}else{ //ret_data.verified === 'T'
					res.render('verify', { 
						user : req.user ,
						page : 'verify'
					});
				}
			}
			res.render('verify', { 
				user : req.user ,
				page : 'verify'
			});
		});
		
	}
});

/*******************/
/* API for Company */
/*******************/
router.get('/mypost', function (req, res) {
	if(!req.user){
		res.redirect('/');
	}else if(req.user.type === 'user'){
		res.redirect('/');
	}else if(req.user.type === 'company'){


		//get my post  
		var URL = "http://52.42.223.87:8080/company/position/"+req.user.username;
	    console.log(URL);
	    var ret_data;
	    request({
		  uri: URL,
		  method: "GET"
		}, function(error, response, body) {
		  	console.log(body);
		  	ret_data = JSON.parse(body);
		  	console.log(ret_data);
		  	console.log(ret_data.positions);
		  	res.render('mypost', { 
				user : req.user ,
				page : 'mypost',
				data : ret_data.positions
			});
		});


		// res.render('mypost', { 
		// 		user : req.user ,
		// 		page : 'mypost',
		// 	});
	}
});

router.get('/editpost', function (req, res) {
	
	//TODO need to add the status change


	if(!req.user){
		res.redirect('/');
	}else if(req.user.type === 'user'){
		res.redirect('/');
	}else if(req.user.type === 'company'){


		var URL = "http://52.42.223.87:8080/position/"+req.query.jobId;
	    console.log(URL);
	    var ret_data;
	    request({
		  uri: URL,
		  method: "GET"
		}, function(error, response, body) {
		  	console.log(body);
		  	ret_data = JSON.parse(body);
		  	console.log(ret_data);

		  	res.render('editpost', { 
				user : req.user ,
				page : 'editpost',
				data : ret_data
			});
		});

	}
});


router.post('/editpost', function (req, res) {
	
	if(!req.user){
		res.redirect('/');
	}else if(req.user.type === 'user'){
		res.redirect('/');
	}else if(req.user.type === 'company'){

		console.log(req.body)
		var URL = "http://52.42.223.87:8080/position/" + req.query.jobId;
		URL = URL + "?cEmail=" + req.user.username;
		URL = URL + "&title=" + req.body.jobtitle;
		URL = URL + "&description=" + req.body.description;
		URL = URL + "&responsibilities=" + req.body.responsibility;
		URL = URL + "&officelocation=" + req.body.officelocation;
		URL = URL + "&salary=" + req.body.salary;
		//STATUS

	    console.log(URL);
	    var ret_data;
	    request({
		  uri: URL,
		  method: "PUT"
		}, function(error, response, body) {
		  	//console.log(body);
		  	ret_data = JSON.parse(body);
		  	console.log("!!!");
		  	console.log(ret_data);

		  	res.redirect('/');
		});

	}
});


router.get('/jobpost', function (req, res) {
	if(!req.user){
		res.redirect('/');
	}else if(req.user.type === 'user'){
		res.redirect('/');
	}else if(req.user.type === 'company'){
		res.render('jobpost', { 
			user : req.user,
			page : 'jobpost'
		});
	}
});





router.post('/jobpost', function (req, res) {
	if(!req.user){
		res.redirect('/');
	}else if(req.user.type === 'user'){
		res.redirect('/');
	}else if(req.user.type === 'company'){


		console.log(req.body)
		var URL = "http://52.42.223.87:8080/position?cEmail="+req.user.username;
		URL = URL + "&title=" + req.body.jobtitle;
		URL = URL + "&description=" + req.body.description;
		URL = URL + "&responsibilities=" + req.body.responsibility;
		URL = URL + "&officelocation=" + req.body.officelocation;
		URL = URL + "&salary=" + req.body.salary;

	    console.log(URL);
	    var ret_data;
	    request({
		  uri: URL,
		  method: "POST"
		}, function(error, response, body) {
		  	console.log(body);
		  	ret_data = JSON.parse(body);
		  	console.log(ret_data);

		  	res.redirect('/');
		});


		
	}
});


router.post('/editcompany', function (req, res) {
	if(!req.user){
		res.redirect('/');
	}else if(req.user.type === 'user'){
		res.redirect('/');
	}else if(req.user.type === 'company'){

		console.log(req.body)
		var URL = "http://52.42.223.87:8080/company/"+req.user.username;
		URL = URL + "?name=" + req.body.name;
		URL = URL + "&website=" + req.body.website;
		URL = URL + "&address=" + req.body.address;
		URL = URL + "&description=" + req.body.description;
		URL = URL + "&logoimageurl=" + req.body.image_url;

	    console.log(URL);
	    var ret_data;
	    request({
		  uri: URL,
		  method: "PUT"
		}, function(error, response, body) {
		  	console.log(body);
		  	ret_data = JSON.parse(body);
		  	console.log(ret_data);

		  	res.render('viewcompany', { 
				user : req.user ,
				page : 'viewcompany',
				data : ret_data
			});
		});



	}
});


router.get('/editcompany', function (req, res) {
	if(!req.user){
		res.redirect('/');
	}else if(req.user.type === 'user'){
		res.redirect('/');
	}else if(req.user.type === 'company'){
		var URL = "http://52.42.223.87:8080/company/"+req.user.username;
	    console.log(URL);
	    var ret_data;
	    request({
		  uri: URL,
		  method: "GET"
		}, function(error, response, body) {
		  	console.log(body);
		  	ret_data = JSON.parse(body);
		  	console.log(ret_data);

		  	res.render('editcompany', { 
				user : req.user ,
				page : 'editcompany',
				data : ret_data
			});
		});
	}
});

router.get('/viewcompany', function (req, res) {
	if(!req.user){
		res.redirect('/');
	}else if(req.user.type === 'user'){
		res.redirect('/');
	}else if(req.user.type === 'company'){

		var URL = "http://52.42.223.87:8080/company/"+req.user.username;
	    console.log(URL);
	    var ret_data;
	    request({
		  uri: URL,
		  method: "GET"
		}, function(error, response, body) {
		  	console.log(body);
		  	ret_data = JSON.parse(body);
		  	console.log(ret_data);

		  	res.render('viewcompany', { 
				user : req.user ,
				page : 'viewcompany',
				data : ret_data
			});
		});
	}
});


router.get('/jobdescription', function (req, res) {

	if(!req.user){
		res.redirect('/');
	}else if(req.user.type === 'user'){
		res.redirect('/');
	}else if(req.user.type === 'company'){

		console.log(req.body)
		var URL = "http://52.42.223.87:8080/position/" + req.query.jobId;
		URL = URL + "?cEmail=" + req.user.username;
		URL = URL + "&title=" + req.body.jobtitle;
		URL = URL + "&description=" + req.body.description;
		URL = URL + "&responsibilities=" + req.body.responsibility;
		URL = URL + "&officelocation=" + req.body.officelocation;
		URL = URL + "&salary=" + req.body.salary;
		//STATUS

	    console.log(URL);
	    var ret_data;
	    request({
		  uri: URL,
		  method: "GET"
		}, function(error, response, body) {
		  	//console.log(body);
		  	ret_data = JSON.parse(body);
		  	console.log("!!!");
		  	console.log(ret_data);

		  	res.render('jobdescription', { 
				user : req.user,
				page : 'jobdescription',
				data : ret_data
			});

		});

	}
});

router.get('/applicantlist', function (req, res) {

	if(!req.user){
		res.redirect('/');
	}else if(req.user.type === 'user'){
		res.redirect('/');
	}else if(req.user.type === 'company'){

	// http://52.42.223.87:8080/position/application/{id}
		var URL = "http://52.42.223.87:8080/position/application/"+req.query.jobId;
		console.log(URL);
	    var ret_data;
	    request({
		  uri: URL,
		  method: "GET"
		}, function(error, response, body) {
		  	//console.log(body);
		  	ret_data = JSON.parse(body);
		  	console.log("!!!");
		  	console.log(ret_data.Applicaitons);

		  	res.render('applicantlist', { 
				user : req.user,
				page : 'applicantlist',
				data : ret_data.Applicaitons
			});

		});


	}
});


router.get('/applicantinfo', function (req, res) {

	if(!req.user){
		res.redirect('/');
	}else if(req.user.type === 'user'){
		res.redirect('/');
	}else if(req.user.type === 'company'){


		var URL = "http://52.42.223.87:8080/jobseeker/"+req.query.id;
	    console.log(URL);
	    var ret_data;
	    request({
		  uri: URL,
		  method: "GET"
		}, function(error, response, body) {
		  	console.log(body);
		  	ret_data = JSON.parse(body);
		  	console.log(ret_data);

		  	res.render('applicantinfo', { 
				user : req.user ,
				page : 'applicantinfo',
				data : ret_data
			});
		});


	}
});



/**********************/
/* API for Job Seeker */
/**********************/
router.get('/jobsearch', function (req, res) {

	var URL = "http://52.42.223.87:8080/position/";
    console.log(URL);
    var ret_data;
    request({
	  uri: URL,
	  method: "GET"
	}, function(error, response, body) {
	  	console.log(body);
	  	ret_data = JSON.parse(body);
	  	console.log(ret_data.AllPositions);

	  	res.render('jobsearch', { 
			user : req.user ,
			page : 'jobsearch',
			data : ret_data.AllPositions
		});
	});
});

router.get('/myapplication', function (req, res) {
	if(!req.user){
		res.redirect('/');
	}

	//http://52.42.223.87:8080/jobseeker/position/{email}
	var URL = "http://52.42.223.87:8080/jobseeker/application/"+req.user.username;
    console.log(URL);
    var ret_data;
    request({
		uri: URL,
		method: "GET"
	}, function(error, response, body) {
	  	console.log(body);
	  	ret_data = JSON.parse(body);
	  	console.log(ret_data.applications);

	  	res.render('myapplication', { 
			user : req.user ,
			page : 'myapplication',
			data : ret_data.applications
		});
	});	
});

router.get('/lovejob', function (req, res) {
	if(!req.user){
		res.redirect('/');
	}else if(req.user.type === 'company'){
		res.redirect('/');
	}else if(req.user.type === 'user'){

		var URL = "http://52.42.223.87:8080/jobseeker/position/"+req.user.username;
	    console.log(URL);
	    var ret_data;
	    request({
		  uri: URL,
		  method: "GET"
		}, function(error, response, body) {
		  	console.log(body);
		  	ret_data = JSON.parse(body);
		  	console.log(ret_data.InterestPositions);

		  	res.render('lovejob', { 
				user : req.user ,
				page : 'lovejob',
				data : ret_data.InterestPositions
			});
		});	


		// res.render('lovejob', { 
		// 	user : req.user ,
		// 	page : 'lovejob' 
		// });
	}
});


router.post('/jobsearch', function (req, res) {


	console.log("????????????????");


	console.log(req.body)
	var title_list = req.body.title.split(" ");
	var companyname_list = req.body.companyname.split(" ");
	var skill_list = JSON.stringify(req.body.skill).split(" ");
	var salarystart = req.body.salarystart;
	var salaryend = req.body.salaryend;
	var location_list = req.body.location.split(" ");
	var count = 0;
	console.log(skill_list);

	var URL = "http://52.42.223.87:8080/position?";
	if(title_list){
		for(var i = 0; i < title_list.length; i++){
			if(i == 0){
				if(count > 0){
					URL = URL + "&";
				}
				URL = URL + "title=" + title_list[i];
			}else{
				URL = URL + "," + title_list[i];
			}
		}
		if(title_list.length > 0){
			count++;
		}
	}
	if(companyname_list){
		for(var i = 0; i < companyname_list.length; i++){
			if(i == 0){
				if(count > 0){
					URL = URL + "&";
				}
				URL = URL + "companyname=" + companyname_list[i];
			}else{
				URL = URL + "," + companyname_list[i];
			}
		}
		if(companyname_list.length > 0){
			count++;
		}
	}
	if(skill_list){
		for(var i = 0; i < skill_list.length; i++){
			if(i == 0){
				if(count > 0){
					URL = URL + "&";
				}
				URL = URL + "skill=" + skill_list[i];
			}else{
				URL = URL + "," + skill_list[i];
			}
		}
		if(skill_list.length > 0){
			count++;
		}
	}
	if(salarystart){
		if(count > 0){
			URL = URL + "&";
		}
		URL = URL + "salarystart=" + salarystart;
		count++;
	}
	if(salaryend){
		if(count > 0){
			URL = URL + "&";
		}
		URL = URL + "salaryend=" + salaryend;
		count++;
	}
	if(location_list){
		for(var i = 0; i < location_list.length; i++){
			if(i == 0){
				if(count > 0){
					URL = URL + "&";
				}
				URL = URL + "location=" + location_list[i];
			}else{
				URL = URL + "," + location_list[i];
			}
		}
		if(location_list.length > 0){
			count++;
		}
	}

	console.log("Start Search!!!!!")
    console.log(URL);
    var ret_data;
    request({
	  uri: URL,
	  method: "GET"
	}, function(error, response, body) {
	  	console.log(body);
	  	ret_data = JSON.parse(body);
	  	console.log(ret_data);

	  	// console.log("AAAAAAAAAAAAAAAAAAAAAAAAA");
	  	console.log(ret_data.AllPositions);

	  	res.render('jobsearch', { 
			user : req.user ,
			page : 'jobsearch',
			data : ret_data.AllPositions
		});

	});


		
});

router.post('/jobsearchAJAX', function (req, res) {


	console.log("????????????????");

	console.log(req.body);


	if(req.body.title)
		var title_list = req.body.title.split(",");
	else
		var title_list = [];
	if(req.body.companyname)
		var companyname_list = req.body.companyname.split(",");
	else
		var companyname_list = [];
	if(req.body.skill)
		var skill_list = req.body.skill.split(",");
	else
		var skill_list = [];
	if(req.body.salarystart)
		var salarystart = req.body.salarystart;
	else
		var salarystart = '';
	if(req.body.salaryend)
		var salaryend = req.body.salaryend;
	else
		var salaryend = '';
	if(req.body.location)
		var location_list = req.body.location.split(",");
	else
		var location_list = [];


	var count = 0;

	var URL = "http://52.42.223.87:8080/position?";
	if(title_list){
		for(var i = 0; i < title_list.length; i++){
			if(i == 0){
				if(count > 0){
					URL = URL + "&";
				}
				URL = URL + "title=" + title_list[i];
			}else{
				URL = URL + "," + title_list[i];
			}
		}
		if(title_list.length > 0){
			count++;
		}
	}
	if(companyname_list){
		for(var i = 0; i < companyname_list.length; i++){
			if(i == 0){
				if(count > 0){
					URL = URL + "&";
				}
				URL = URL + "companyname=" + companyname_list[i];
			}else{
				URL = URL + "," + companyname_list[i];
			}
		}
		if(companyname_list.length > 0){
			count++;
		}
	}
	if(skill_list){
		for(var i = 0; i < skill_list.length; i++){
			if(i == 0){
				if(count > 0){
					URL = URL + "&";
				}
				URL = URL + "skill=" + skill_list[i];
			}else{
				URL = URL + "," + skill_list[i];
			}
		}
		if(skill_list.length > 0){
			count++;
		}
	}
	if(salarystart){
		if(count > 0){
			URL = URL + "&";
		}
		URL = URL + "salarystart=" + salarystart;
		count++;
	}
	if(salaryend){
		if(count > 0){
			URL = URL + "&";
		}
		URL = URL + "salaryend=" + salaryend;
		count++;
	}
	if(location_list){
		for(var i = 0; i < location_list.length; i++){
			if(i == 0){
				if(count > 0){
					URL = URL + "&";
				}
				URL = URL + "location=" + location_list[i];
			}else{
				URL = URL + "," + location_list[i];
			}
		}
		if(location_list.length > 0){
			count++;
		}
	}

	console.log("Start AJAX Search!!!!!")
    console.log(URL);
    var ret_data;
    request({
	  uri: URL,
	  method: "GET"
	}, function(error, response, body) {
	  	console.log(body);
	  	ret_data = JSON.parse(body);
	  	console.log("AJAX result");

	  	// console.log("AAAAAAAAAAAAAAAAAAAAAAAAA");
	  	console.log(ret_data.AllPositions);
	  	res.send(ret_data.AllPositions);
	 //  	res.render('jobsearch', { 
		// 	user : req.user ,
		// 	page : 'jobsearch',
		// 	data : ret_data.AllPositions
		// });

	});


		
});



router.get('/editprofile', function (req, res) {
	if(!req.user){
		res.redirect('/');
	}else if(req.user.type === 'company'){
		res.redirect('/');
	}else if(req.user.type === 'user'){
		var URL = "http://52.42.223.87:8080/jobseeker/"+req.user.username;
	    console.log(URL);
	    var ret_data;
	    request({
		  uri: URL,
		  method: "GET"
		}, function(error, response, body) {
		  	console.log(body);
		  	ret_data = JSON.parse(body);
		  	console.log(ret_data);

		  	res.render('editprofile', { 
				user : req.user ,
				page : 'editprofile',
				data : ret_data
			});
		});
	}
});

router.post('/editprofile', function (req, res) {
	if(!req.user){
		res.redirect('/');
	}else if(req.user.type === 'company'){
		res.redirect('/');
	}else if(req.user.type === 'user'){
		
		console.log(req.body)
		var URL = "http://52.42.223.87:8080/jobseeker/"+req.user.username;
		URL = URL + "?firstname=" + req.body.firstname;
		URL = URL + "&lastname=" + req.body.lastname;
		URL = URL + "&selfintroduction=" + req.body.introduction;
		URL = URL + "&workexperience=" + req.body.experience;
		URL = URL + "&education=" + req.body.education;
		URL = URL + "&skills=" + req.body.skills;
		URL = URL + "&picture=" + req.body.picture;
	    console.log(URL);
	    var ret_data;
	    request({
		  uri: URL,
		  method: "PUT"
		}, function(error, response, body) {
		  	console.log(body);
		  	ret_data = JSON.parse(body);
		  	console.log(ret_data);

		  	res.render('viewprofile', { 
				user : req.user ,
				page : 'viewprofile',
				data : ret_data
			});
		});
	}
});

router.get('/viewprofile', function (req, res) {
	if(!req.user){
		res.redirect('/');
	}else if(req.user.type === 'company'){
		res.redirect('/');
	}else if(req.user.type === 'user'){
		var URL = "http://52.42.223.87:8080/jobseeker/"+req.user.username;
	    console.log(URL);
	    var ret_data;
	    request({
		  uri: URL,
		  method: "GET"
		}, function(error, response, body) {
		  	console.log(body);
		  	ret_data = JSON.parse(body);
		  	console.log(ret_data);

		  	res.render('viewprofile', { 
				user : req.user ,
				page : 'viewprofile',
				data : ret_data
			});
		});
		
	}
});

router.get('/jobdetail', function (req, res) {

	if(req.user){
		if(req.user.type === 'company'){
			res.redirect('/');
		}
	}

	var URL = "http://52.42.223.87:8080/position/"+req.query.jobId;;
    console.log(URL);
    var ret_data;
    request({
	  uri: URL,
	  method: "GET"
	}, function(error, response, body) {
	  	console.log(body);
	  	ret_data = JSON.parse(body);
	  	console.log(ret_data);

	  	res.render('jobdetail', { 
			user : req.user ,
			page : 'jobdetail',
			data : ret_data
		});
	});


});

router.get('/mark', function (req, res) {

	if(!req.user){
		res.redirect('login');
	}else if(req.user.type === 'company'){
		res.redirect('/');
	}else if(req.user.type === 'user'){
		// http://52.42.223.87:8080/jobseeker/{email}?mark=pid
		http://52.42.223.87:8080/jobseeker/{email}?unmark=pid
		var URL = "http://52.42.223.87:8080/jobseeker/"+req.user.username+"?mark="+req.query.jobId;
	    console.log(URL);
	    var ret_data;
	    request({
		  uri: URL,
		  method: "POST"
		}, function(error, response, body) {
		  	console.log(body);

		  	backURL=req.header('Referer') || '/';
  			res.redirect(backURL);
		});
	}

});


router.get('/unmark', function (req, res) {

	if(!req.user){
		res.redirect('login');
	}else if(req.user.type === 'company'){
		res.redirect('/');
	}else if(req.user.type === 'user'){

		var URL = "http://52.42.223.87:8080/jobseeker/"+req.user.username+"?unmark="+req.query.jobId;
	    console.log(URL);
	    var ret_data;
	    request({
		  uri: URL,
		  method: "POST"
		}, function(error, response, body) {
		  	console.log(body);

		  	backURL=req.header('Referer') || '/';
  			res.redirect(backURL);
		});
	}

});


router.get('/offer', function (req, res) {

	if(!req.user){
		res.redirect('login');
	}else if(req.user.type === 'company'){
		res.redirect('/');
	}else if(req.user.type === 'user'){

		//http://52.42.223.87:8080/application/{id}?sEmail=1&reply=””
		var URL = "http://52.42.223.87:8080/application/"+req.query.id+"?sEmail="+req.user.username+"&reply="+req.query.action;
	    console.log(URL);
	    var ret_data;
	    request({
		  uri: URL,
		  method: "PUT"
		}, function(error, response, body) {
			console.log("!!!!!!!!")
		  	console.log(body);
		  	backURL=req.header('Referer') || '/';
  			res.redirect(backURL);
		});
	}

});

router.get('/jobseekerpending', function (req, res) {

	if(!req.user){
		res.redirect('login');
	}else if(req.user.type === 'company'){
		res.redirect('/');
	}else if(req.user.type === 'user'){

		//http://52.42.223.87:8080/application?sEmail=1&aid=1,2,3,4&reply=”Cancel”
		var URL = "http://52.42.223.87:8080/application/jobseeker?sEamil="+req.user.username+"&aid="+req.query.id+"&reply="+req.query.action;
	    console.log(URL);
	    var ret_data;
	    request({
		  uri: URL,
		  method: "PUT"
		}, function(error, response, body) {
			console.log("!!!!!!!!")
		  	console.log(body);
		  	backURL=req.header('Referer') || '/';
  			res.redirect(backURL);
		});
	}

});


router.get('/companypending', function (req, res) {

	if(!req.user){
		res.redirect('login');
	}else if(req.user.type === 'user'){
		res.redirect('/');
	}else if(req.user.type === 'company'){

		//http://52.42.223.87:8080/application?cEmail=1&aid=1&reply=””
		var URL = "http://52.42.223.87:8080/application/company?cEmail="+req.user.username+"&aid="+req.query.id+"&reply="+req.query.action;
	    console.log(URL);
	    var ret_data;
	    request({
		  uri: URL,
		  method: "PUT"
		}, function(error, response, body) {
			console.log("!!!!!!!!")
		  	console.log(body);
		  	backURL=req.header('Referer') || '/';
  			res.redirect(backURL);
		});
	}

});


router.get('/positionstatus', function (req, res) {

	if(!req.user){
		res.redirect('login');
	}else if(req.user.type === 'user'){
		res.redirect('/');
	}else if(req.user.type === 'company'){

		//http://52.42.223.87:8080/position/{id}?cEmail=1&status=FF
		var URL = "http://52.42.223.87:8080/position/"+req.query.id+"?cEmail="+req.user.username+"&status="+req.query.action;
	    console.log(URL);
	    var ret_data;
	    request({
		  uri: URL,
		  method: "PUT"
		}, function(error, response, body) {
			console.log("!!!!!!!!")
		  	console.log(body);
		  	backURL=req.header('Referer') || '/';
  			res.redirect(backURL);
		});
	}

});


router.post('/apply', function (req, res) {

	if(!req.user){
		res.redirect('login');
	}else if(req.user.type === 'company'){
		res.redirect('/');
	}else if(req.user.type === 'user'){

		// http://52.42.223.87:8080/jobseeker/sEmail pid
		var URL = "http://52.42.223.87:8080/application?sEmail="+req.user.username+"&pid="+req.query.jobId+"&resumeUrl="+req.body.resumeUrl;
	    console.log(URL);
	    var ret_data;
	    request({
		  uri: URL,
		  method: "POST"
		}, function(error, response, body) {
		  	console.log(body);

		  	backURL=req.header('Referer') || '/';
  			res.redirect(backURL);
		});
	}

});

// router.get('/login', function (req, res) {
// 	res.render('login');
// });



// router.get('/', (req, res) => {
//     res.render('index', { user : req.user });
// });




/************************/
/* API for Login System */
/************************/
router.get('/register', (req, res) => {
    res.render('register', { error : req.flash('error') });
});

router.post('/register', (req, res, next) => {
    Account.register(new Account({ username : req.body.username, type : req.body.type }), req.body.password, (err, account) => {
        if (err) {
          return res.render('register', { error : err.message });
        }

        passport.authenticate('local')(req, res, () => {
            req.session.save((err) => {
                if (err) {
                    return next(err);
                }
                //HTTP REQUEST
                if(req.body.type ==="user"){
	                var URL = "http://52.42.223.87:8080/jobseeker";
	                URL = URL + "?firstname="+req.body.firstname;
	                URL = URL + "&lastname="+req.body.lastname;

	                URL = URL + "&workexperience="+req.body.experience;
	                URL = URL + "&education="+req.body.education;
	                URL = URL + "&skills="+req.body.skill;

	                URL = URL + "&email="+req.body.username;
	                URL = URL + "&password="+req.body.password;

	                if(req.body.introduction)
	                	URL = URL + "&selfintroduction="+req.body.introduction;
	                if(req.body.picture)
	                	URL = URL + "&picture="+req.body.picture;
	                console.log(URL);
	                request({
					  uri: URL,
					  method: "POST"
					}, function(error, response, body) {
					  console.log(body);
					});
	             }else{ //req.body.type ==="company"
	             	var URL = "http://52.42.223.87:8080/company";
	             	URL = URL + "?name="+req.body.name;
	             	URL = URL + "&website="+req.body.website;
	             	URL = URL + "&address="+req.body.address;
	             	URL = URL + "&description="+req.body.description;
	             	URL = URL + "&logoimageurl="+req.body.image_url;
	             	URL = URL + "&email="+req.body.username;
	             	URL = URL + "&password="+req.body.password;
	                console.log(URL);
	                request({
					  uri: URL,
					  method: "POST"
					}, function(error, response, body) {
					  console.log(body);
					});

	             }

                res.redirect('login');
            });
        });
    });
});

router.get('/login', (req, res) => {
    res.render('login', { user : req.user, error : req.flash('error')});
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), (req, res, next) => {
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        
        res.redirect('/');
    });
});


router.get('/verify', (req, res) => {
    res.render('verify', { user : req.user});
});

router.post('/verify', function (req, res) {

	if(!req.user){
		res.redirect('login');
	}else if(req.user.type === 'company'){

		var URL = "http://52.42.223.87:8080/company/"+req.user.username;
	    console.log(URL);
	    var ret_data;
	    request({
		  uri: URL,
		  method: "GET"
		}, function(error, response, body) {
		  	console.log(body);
		  	ret_data = JSON.parse(body);
		  	console.log(ret_data);

		  	if(ret_data.code){
			  	if(ret_data.code === req.body.code){

					var URL = "http://52.42.223.87:8080/company/"+req.user.username;
					URL = URL + "?verified=" + 'T';
				    console.log(URL);
				    var ret_data;
				    request({
					  uri: URL,
					  method: "PUT"
					}, function(error, response, body) {
					  	console.log(body);
					  	res.redirect('/');
					});
				}else{
					res.redirect('/');
				}
			}else{
				res.redirect('/');
			}
		});
	}else if(req.user.type === 'user'){





		var URL = "http://52.42.223.87:8080/jobseeker/"+req.user.username;
	    console.log(URL);
	    var ret_data;
	    request({
		  uri: URL,
		  method: "GET"
		}, function(error, response, body) {
		  	console.log(body);
		  	ret_data = JSON.parse(body);
		  	console.log(ret_data);

		  	console.log("!!!!!   ret_data.code");
		  	console.log(ret_data.code);
		  	console.log("!!!!!   	req.body.code");
		  	console.log(req.body.code);
		  	if(ret_data.code){
			  	if(ret_data.code === req.body.code){
					var URL = "http://52.42.223.87:8080/jobseeker/"+req.user.username;
					URL = URL + "?verified=" + 'T';
				    console.log(URL);
				    var ret_data;
				    request({
					  uri: URL,
					  method: "PUT"
					}, function(error, response, body) {
					  	console.log(body);
					  	res.redirect('/');
					});
				}else{
					res.redirect('/');
				}
			}else{
				res.redirect('/');
			}
		});
	}

});


router.get('/logout', (req, res, next) => {
    req.logout();
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        backURL=req.header('Referer') || '/';
  		res.redirect(backURL);
    });
});

//AJAX  test
router.get('/joblist', function(req, res){
	res.render('job_list');
});

router.get('/job', function(req, res){
	res.render('job_single');
});

module.exports = router;

