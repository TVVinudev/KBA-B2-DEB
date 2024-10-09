const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askName(){
    rl.question('what is your name : ',function(name){
        console.log(`hello,${name}`);
        askFavoriteLanguage();
    })
}

function askFavoriteLanguage(){
    rl.question('what is your favorite language : ',function(language){
        console.log(`${language} is a great choice`);
        rl.close();
    })
}

//start terminal

console.log('welsome to simple interface using readline');
askName();