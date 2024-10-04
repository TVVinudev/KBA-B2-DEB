console.log('20' + 5); //205 is the out put - string conversion
console.log("20"-5); //15 is the output - converted to integer
console.log("20" * 5); //100 is the output - converted to integer
console.log("20"/5); //4 is the output - converted to integer


console.log(true +1); // output = 2
console.log(Number('25')); // convert string to interger using Number() function
console.log(Number("hello")); // alphabets are never converted to integer


console.log(typeof String(123)); //String() convert the number to a string  and return the typeof as the 'String'
console.log(String(true)); // output - true, its convert the boolean value to string


console.log(Boolean(0)); // false
console.log(Boolean(" ")); // empty string also false
console.log(Boolean("Hello")); // this contains a string, so tis return a true ;
console.log(Boolean(1)); // true

console.log(parseInt("12.45")); // it returns 12. only takes integer part
console.log(parseFloat("23.2")); // it return 23.2 
