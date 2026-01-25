import cron from "cron";
import https from "https";

const URL = "https://graph-ql-v6on.onrender.com";

const job = new cron.CronJob('*/14 * * * *', function(){
    https.get(URL, (res) => {
        if (res.statusCode === 200){
            console.log("GET request sent successfully!");
        }else{
            console.log(`GET request failed with status code: ${res.statusCode}`);
    }
    }).on("error", (e) => {
        console.log("Error sending GET request", e);
    })
});


export default job;



















// CRON JOB EXPLANATION:
// Cron jobs are scheduled tasks that run periodically at fixed intervals or specific times
// send 1 GET request for every 14 minutes

// Schedule:
// You define a schedule using a cron expression, which consists of five fields representing:

//! MINUTE, HOUR, DAY OF THE MONTH, MONTH, DAY OF THE WEEK

//? EXAMPLES && EXPLANATION:
//*/ 14 * * * * - Every 14 minutes
//* 0 0 * * 0 - At midnight on every Sunday
//* 30 3 15 * * - At 3:30 AM, on the 15th of every month
//* 0 0 1 1 * - At midnight, on January 1st
//* 0 * * * * - Every hour













//1. For a function declaration:

// function greet() {
//   return "Hello!";
// }
// console.log(greet());



//2. For a function expression:

// const greet = function() {
//   return "Hello!";
// };
// console.log(greet());



//3. For an arrow function:

// const greet = () => {
//     return "Hello!";
// }



// const greet = () => "Hello!";
// console.log(greet());




//4. For a method inside an object:

// const obj = {
//   greet() {
//     return "Hello!";
//   }
// };
// console.log(obj.greet());





//5. For a constructor function:

// function Person(name) {
//   this.name = name;
//   this.greet = function() {
//     return "Hello, " + this.name + "!";
//   };
// }
// const person = new Person("Alice");
// console.log(person.greet());






//6. For an async function:

// async function greetAsync() {
//   return "Hello!";
// }
// greetAsync().then(console.log);

// Each of these will print some form of "Hello!" to the console!



//7. For a class method:
// const user = new User(function() {
//   console.log("hello");
// });

// const job = new cron.CronJob(...)