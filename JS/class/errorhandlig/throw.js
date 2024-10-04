
function checkAge(age) {
    if (age < 18) {
        throw new Error("you must be 18 years or older");
    } else {
        console.log('You are allowed')
    }
}


try {
    checkAge(12);
} catch (error) {
    console.log(error)
} finally {
    console.log("This always executes!")
}