

try {
    let result = riskyOperation();
    console.log(result);
} catch (error) {
    console.log("an error occure : " + error.message);
}finally{
    console.log("This will always Run")
}


function riskyOperation(){
    let obj;
    obj.property;
}
