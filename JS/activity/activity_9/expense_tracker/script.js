let expenses = [];
let categories = [];

function addExpense() {

    let descInput = document.getElementById('decrptn');
    let expAmntInp = document.getElementById('amount');
    let catgryInp = document.getElementById('catgry');
    let expnslist = document.getElementById('expenselist');

    let descrptn = descInput.value.trim();
    let amount = Number(expAmntInp.value.trim());
    let category = Number(catgryInp.value.trim());

    if (descrptn != '' && amount != NaN && category >= 1 && category <= 3) {

        let expense = descrptn + '-' + amount;
        expenses.push(expense);
        categories.push(category);

        let li = document.createElement('li');
        li.textContent = expense;

        switch (category) {

            case 1:
                li.classList.add('expns-food');
                break;
            case 2:
                li.classList.add('expns-transport');
                break;
            case 3:
                li.classList.add('expns-entertainment');
                break;
        }
        expnslist.appendChild(li);

        const compltButton = document.createElement('button');
        compltButton.textContent = 'Complete';
        compltButton.onclick = function () {
            li.classList.toggle('completed')
        }
        li.appendChild(compltButton)

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.onclick = function () {

            let newdscrptn = prompt('Edit the description', descrptn)
            let expnsIndex = expenses.indexOf(descrptn);
            expenses[expnsIndex] = newdscrptn;
            li.firstChild.textContent = newdscrptn;
            descrptn = newdscrptn;
        }
        li.appendChild(editButton)

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = function () {

            expnslist.removeChild(li);
            let expnsIndex = expenses.indexOf(expense);
            expenses.splice(expnsIndex, 1);
            priorities.splice(expnsIndex, 1);

        }
        li.appendChild(removeButton)
    }
}