const { response } = require("express");
const express=require("express");

const app=express();

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/libraryDB');

// var flag;


const bookSchema=new mongoose.Schema({
    name:{

        type:String,
        required:[true,"Must enter name"]
    },

    firstAuthor:{
        type:String,
        required:[true,"Must enter first author"]
    },

    secondAuthor:String
    ,
    isbn:{
        type:Number,
        unique:true
    },

    publishedYear:Number

});

const Book=new mongoose.model("Book",bookSchema);

const studentSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Must enter name"]
    },
    rollno:{
        type:String,
        required:[true,"Must enter roll_no"],
        unique:true
     },

    booksAssigned:Array
});

const Student=new mongoose.model("Student",studentSchema);


// FOR BOOKS

app.get('/', function(req,res){
    res.writeHead(200,{'Context-Type':'text/json'});

    Book.find(function(err,books){

        if(err){
            res.write(err);
            res.end();
        }else{
            res.write(JSON.stringify(books));
            res.end();
        }

    });
    
});

app.post('/addBook', function(req,res){

    let name=req.query.name;
    let firstAuthor=req.query.firstAuthor;
    let secondAuthor=req.query.secondAuthor;
    let isbn=req.query.isbn;
    let publishedYear=req.query.publishedYear;

    console.log(name);

    const book=new Book({

        name:name,
        firstAuthor:firstAuthor,
        secondAuthor:secondAuthor,
        isbn:isbn,
        publishedYear:publishedYear
    });

    book.save(function(err,back)
    {
        if(err)
        {
             res.send("Error: "+err);
        }
        else{
             res.send("Successfully inserted data :"+back);
            
        }
    });

    // res.send("Successfully inserted data");

    
});



app.put('/updateBook', function(req,res){

    let name=req.query.name;
    let firstAuthor=req.query.firstAuthor;
    let secondAuthor=req.query.secondAuthor;
    let isbn=req.query.isbn;
    let publishedYear=req.query.publishedYear;

    Book.findOneAndUpdate({isbn:isbn},{ name:name,firstAuthor:firstAuthor,secondAuthor:secondAuthor,publishedYear:publishedYear}, function(err,back){
        if(err)
        {
            res.send("Error : "+err);
        }else{
            if(!back){
                res.send("does not exist");
            }
            else{
                res.send(" Updated : "+back);
                // res.send("hello");
            }
        }

    });
    
});

app.delete('/deleteBookByIsbn', function(req,res){

    let isbn=req.query.isbn;

    Book.findOneAndDelete({isbn:isbn},function(err,back){

        if(err)
        {
            res.send(err);
        }else{
            
            if(!back){
                res.send("does not exist");
            }
            else{
                res.send("Deleted : "+back);
            }
        }
    });
});

app.delete('/deleteBookByName', function(req,res){

    let name=req.query.name;

    Book.deleteMany({name:name},function(err,back){

        if(err)
        {
            res.send(err);
        }else{
            if(!back){
                res.send("does not exist");
            }
            else{
                res.send("Deleted : "+back);
            }
        }
    });
});


// FOR STUDENTS

app.post('/addStudent', function(req,res){

    let name=req.query.name;
    let rollno=req.query.rollno;


    console.log(name);

    const student=new Student({

        name:name,
        rollno:rollno
 
    });

    student.save(function(err,back){
        if(err){
            res.send("Error: "+err);
        }else{
            // if(!back){
            //     res.send("student can't be added");
            // }
            // else
            // {
            //     res.send(back);
            // }
            res.send("Successfully added: "+back);
        }

    });

    // res.send("Successfully inserted data");

    
});


app.get('/showStudentDetails', function(req,res){
    res.writeHead(200,{'Context-Type':'text/json'});

    Student.find(function(err,students){

        if(err){
            res.write(err);
            res.end();
        }else{
            res.write(JSON.stringify(students));
            res.end();
        }

    });
    
});

app.post('/assignBook', function(req,res){

    let rollno=req.query.rollno;
    let isbn=req.query.isbn;

    Student.find({rollno:rollno},function(err,student){
        if(err){

        }else{
            if(student.length!=0){
                Book.find({isbn:isbn},function(err,book){

                    if(err){
                        res.send(err);
                    }
                    else{
                        // var me=false;
                        if(book.length!=0){

                            
                            var flag=false;

                            // res.send(book[0]);

                            Student.find(function(err,students){

                                // flag=false;

                                

                                if(err){
                                    res.send(err);
                                    
                                }else{
                                     console.log(students);

                                    students.forEach(function(stud){
                                        console.log(stud.booksAssigned);
                                        //console.log(stud.booksAssigned.isbn);
                                        if(stud.booksAssigned.length!=0)
                                        {
                                            console.log("I'm not empty");

                                            stud.booksAssigned.forEach(function(assigned){

                                                console.log(assigned.isbn);
                                                if(assigned.isbn==isbn){
                                                    console.log("true");
                                                    flag=true;
                                                    console.log(flag);
                                                }


                                            });
                                        }
                                    });

                                    if(flag)
                                    {
                                        res.send("book already assigned");
                                    }
                                    else
                                    {
                                        //res.send("let me assign book");

                                        let b=book[0];

                                        student[0].booksAssigned.push(b);

                                        Student.findOneAndUpdate({rollno:rollno},{booksAssigned:student[0].booksAssigned},function(err,back){

                                            if(err)
                                            {
                                                res.send(err);
                                            }
                                            // else{
                                            //     res.send(back);
                                            // }
                                        });

                                        res.send("successfully assigned");

                                        // console.log("im lower flag");
                                    }
                                }
                            });


                            // if(flag)
                            // {
                            //     res.send("book already assigned");
                            // }
                            // else
                            // {
                            //     res.send("let me assign book");
                            //     // console.log("im lower flag");
                            // }




                            // works

                            // let b=book[0];

                            // student[0].booksAssigned.push(b);

                            // Student.findOneAndUpdate({rollno:rollno},{booksAssigned:student[0].booksAssigned},function(err,back){

                            //     if(err)
                            //     {
                            //         res.send(err);
                            //     }
                            //     else{
                            //         res.send(back);
                            //     }
                            // });
                            // works



                            // student[0].booksAssigned.push(b);

                            

                            // res.send(student);

                        }
                        else
                        {
                            res.send("Book doesn't exist");
                        }

                    }
                });
            }
            else
            {
                res.send("Student does'nt exist");
            }
        }
    });

});





app.listen(3000, function(){
    console.log("Server started on port 3000")
});