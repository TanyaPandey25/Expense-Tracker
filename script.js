const balanceEl = document.getElementById('balance');
const incomeAmountEl = document.getElementById('income-amount');
const expenseAmountEl = document.getElementById('expense-amount');
const transactionListEl = document.getElementById('transaction-list');
const transactionFormEl = document.getElementById('transaction-form');
const descriptionEl = document.getElementById('description');
const amountEl = document.getElementById('amount');

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

transactionFormEl.addEventListener("submit", addTransaction);

function addTransaction(e) {
    e.preventDefault(); //prevent from refreshing the page

    // get form values
    const description = descriptionEl.value.trim();
    const amount = parseFloat(amountEl.value);

    transactions.push({ 
        id: Date.now(),
        description,
        amount
    });

    localStorage.setItem("transactions", JSON.stringify(transactions));

    updateTransactionList();
    updateSummary();

    transactionFormEl.reset(); // clear the form inputs
}

function updateTransactionList() {
    transactionListEl.innerHTML = ""; // clear the list- resetting the list before adding new transactions

    const sortedTransactions = [...transactions].reverse(); // sort transactions in reverse order to show the latest first

    sortedTransactions.forEach((transaction)=>{
        const transactionEl = createTransactionElement(transaction);
        transactionListEl.appendChild(transactionEl);
    })
}

function createTransactionElement(transaction){
    const li = document.createElement("li");
    li.classList.add("transaction");
    li.classList.add(transaction.amount>0 ? "income" : "expense");
    li.innerHTML = `
        <span>${transaction.description}</span>

        <span>${formatCurrency(transaction.amount)}
            <button class ="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
        </span>
    `;

    return li;
}

function updateSummary(){
    // 100, -50, 200, -200 => 0 + 100 + -50 + 200 + -200 = 50
    const balance = transactions.reduce((acc, transaction) => acc+transaction.amount, 0); // we can use reduce to calculate the balance by adding all the transaction amounts together; here "acc" is the accumulator and "transaction.amount" is the current value being processed in the array; we start with an initial value of 0 for the accumulator

    const income= transactions.filter(transaction => transaction.amount>0).reduce((acc, transaction) => acc+transaction.amount, 0); // we can use filter to get only the income transactions and then use reduce to calculate the total income

    const expenses = transactions.filter(transaction => transaction.amount<0).reduce((acc, transaction) => acc+transaction.amount, 0); // we can use filter to get only the expense transactions and then use reduce to calculate the total expense

    //update ui
    balanceEl.textContent = formatCurrency(balance);
    incomeAmountEl.textContent = formatCurrency(income);
    expenseAmountEl.textContent = formatCurrency(expenses);
}

function formatCurrency(number){
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(number);
}

function removeTransaction(id){
    //filter out the one we want to remove
    transactions = transactions.filter(transaction => transaction.id!==id);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    updateTransactionList();
    updateSummary();
}
//initial render
updateTransactionList();
updateSummary();