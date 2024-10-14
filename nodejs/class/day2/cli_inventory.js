
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const inventory = new Map();

function askCommand() {
    console.log('welcome to inventory system');
    console.log('available commands : add, remove, search, update, summury, exit');
    rl.question('enter the command : ', function (commands) {
        switch (commands.trim().toLowerCase()) {
            case 'add': addItemPrompt(); break;
            case 'remove': removeItemPrompt(); break;
            case 'search': searchItemPrompt(); break;
            case 'update': updateItemPrompt(); break;
            case 'summury': summuryItemPrompt(); askCommand(); break;
            case 'exit': rl.close(); break;
            default: console.log('invalid input'); askCommand(); break;
        }
    });
}

//add function

function addItemPrompt(){
    rl.question('enter the item id : ', function (id) {
        rl.question('enter the item name :', function (name) {
            rl.question('enter item catagory : ', function (catagory) {
                rl.question('enter item quantity :', function (quantity) {
                    addItem(id, name, catagory, quantity);
                    askCommand();
                })
            })
        })
    })
}

function addItem(id, name, catagory, quantity) {
    if (inventory.has(id)) {
        console.log(`Error items with id ${id} is already exists.`)
    } else {
        inventory.set(id, { name, catagory, quantity });
        console.log(`Items with ID ${id} added to inventory ! `);

    }
}

//remove item

function removeItemPrompt() {
    rl.question('Enter the id to remove : ', function (id) {
        removeItem(id);  
        askCommand();
    })
}

function removeItem(id) {
    if (inventory.has(id)) {
        inventory.delete(id);
        console.log(`items with id ${id} has been removed !`);
      
    } else {
        console.log(`Error : No item with ${id} `)
    }
}

//search item

function searchItemPrompt() {
    rl.question('Enter the scarch item : ',function(search) {
        searchItem(search);
        askCommand();
    })
}

function searchItem(search) {
    const result = [];
    for (const [id, item] of inventory) {
        // includes using search items
        if (id.includes(search) || item.name.includes(search) || item.catagory.includes(search) || item.quantity.includes(search)) {
            result.push({ id, ...item }); // spread operator
        }
    }

    if (result.length > 0) {
        console.log('Search Results : ', result)
    } else {
        console.log('No item found');
    }


}

//update items

function updateItemPrompt() {
    rl.question('enter the item id : ', function (id) {
        rl.question('enter the item name :', function (newName) {
            rl.question('enter item catagory : ', function (newCatagory) {
                rl.question('enter item quantity :', function (newQuantity) {
                    updateItem(id, newName, newCatagory, newQuantity ? parseInt(newCatagory) : undefined);
                    askCommand();
                })
            })
        })
    })
}

function updateItem(id, newName, newCatagory, newQuantity) {
    if (inventory.has(id)) {
        const item = inventory.get(id);
        item.name = newName || item.name;
        item.catagory = newCatagory || item.catagory;
        item.quantity = newQuantity == !undefined ? newQuantity : item.quantity;

        inventory.set(id, item);
        console.log(`items with ${id} updated`);
    }
    else {
        console.log('No item found');
    }

}


//summury 


function summuryItemPrompt() {
    if (inventory.size > 0) {
        for (const [id, item] of inventory) {
            console.log(`id : ${id}`);
            console.log(`name : ${item.name}`);
            console.log(`catagory : ${item.catagory}`);
            console.log(`quantity : ${item.quantity}`);
        }
    }else{
        console.log('No items found!');
    }
}

askCommand();
