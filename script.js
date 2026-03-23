let balance = 25000;
let transactions = [];
let chartInstance = null;
let userPIN = "1234";
window.onload = function(){

    document.getElementById("accNoDisplay").innerText =
        localStorage.getItem("accountNo");

    document.getElementById("nameDisplay").innerText =
        localStorage.getItem("userName");

    updateBalance();
    showMenu();
    renderChart();
};
function loanInfo(){

    let msg =
    "🏦 Loan Details:\n\n" +
    "Types: Home, Car, Personal\n\n" +
    "Eligibility:\n" +
    "• Salary ≥ ₹20,000\n" +
    "• Age: 21–60\n\n" +
    "Documents:\n" +
    "• ID Proof\n" +
    "• Salary Slips\n\n" +
    "Interest: 8% - 12%";

    display(msg, "bot");
}
/* BALANCE */
function updateBalance(){
    document.getElementById("balanceDisplay").innerText =
        "Balance: ₹" + balance;
}

/* VALIDATION */
function valid(x){
    return /^\d+$/.test(x);
}

/* BANK */
function creditMoney(){
    let amt = prompt("Enter amount");

    if(!valid(amt)) return alert("Invalid");

    balance += Number(amt);
    updateBalance();
    addTx("Credit", amt);
}

function debitMoney(){
    let amt = prompt("Enter amount");

    if(!valid(amt)) return alert("Invalid");
    if(amt > balance) return alert("No balance");

    balance -= amt;
    updateBalance();
    addTx("Debit", amt);
}

function withdrawMoney(){
    debitMoney();
}

function checkBalance(){
    display("Balance ₹" + balance,"bot");
}

/* TRANSACTION */
function addTx(type, amt){
    transactions.push({
        type,
        amt,
        time:new Date().toLocaleTimeString()
    });

    renderTable();
    renderChart();
}

function renderTable(){
    let t = document.getElementById("transactionTable");

    t.innerHTML = "<tr><th>Type</th><th>Amount</th><th>Time</th></tr>";

    transactions.forEach(x=>{
        let r = t.insertRow();
        r.insertCell(0).innerText = x.type;
        r.insertCell(1).innerText = "₹"+x.amt;
        r.insertCell(2).innerText = x.time;
    });
}
function changePIN(){

    let oldPin = prompt("Enter current PIN:");

    if(oldPin !== userPIN){
        display("❌ Incorrect PIN", "bot");
        return;
    }

    let newPin = prompt("Enter new 4-digit PIN:");

    if(!/^\d{4}$/.test(newPin)){
        display("❌ PIN must be exactly 4 digits", "bot");
        return;
    }

    userPIN = newPin;

    display("✅ PIN updated successfully", "bot");
}
let isCardBlocked = false;

function blockCard(){
    isCardBlocked = true;
    display("🚫 Your card has been BLOCKED", "bot");
}
function miniStatement(){

    if(transactions.length === 0){
        display("No transactions yet", "bot");
        return;
    }

    let last = transactions.slice(-5);

    let msg = "📄 Last Transactions:\n";

    last.forEach(t => {
        msg += `${t.type} ₹${t.amt} at ${t.time}\n`;
    });

    display(msg, "bot");
}
/* CHAT */
function display(msg,type){
    let d = document.createElement("div");
    d.className = type;
    d.innerText = msg;
    messages.appendChild(d);
}

function sendMessage(){
    let m = userInput.value;
    if(m==="") return;

    display(m,"user");

    let r = getReply(m);
    display(r,"bot");

    userInput.value="";
}

function getReply(msg){

    msg = msg.toLowerCase();

    if(msg.includes("balance")){
        return "Your balance is ₹" + balance;
    }

    if(msg.includes("loan")){
        return "Loans available: Home, Car, Personal.\nMin salary ₹20,000";
    }

    if(msg.includes("atm")){
        return "ATM available 24/7.";
    }

    if(msg.includes("transfer")){
        return "Use sidebar to transfer money.";
    }

    if(msg.includes("emi")){
        return "EMI = Loan × Interest / Months.";
    }

    if(msg.includes("block")){
        return "Your card can be blocked from menu.";
    }

    if(msg.includes("pin")){
        return "PIN must be 4 digits.";
    }

    if(msg.includes("hello") || msg.includes("hi")){
        return "Hello 👋 How can I help you?";
    }

    return "Try: balance, loan, atm, transfer";
}
function calculateEMI(){

    let P = prompt("Enter loan amount:");
    let R = prompt("Interest rate (per year %):");
    let N = prompt("Duration (months):");

    if(!/^\d+$/.test(P) || !/^\d+$/.test(R) || !/^\d+$/.test(N)){
        display("❌ Invalid input (numbers only)", "bot");
        return;
    }

    P = Number(P);
    R = Number(R) / 12 / 100;
    N = Number(N);

    let emi = (P * R * Math.pow(1+R,N)) / (Math.pow(1+R,N)-1);

    display("📊 EMI = ₹" + emi.toFixed(2), "bot");
}
/* MENU */
function showMenu(){

    let div = document.createElement("div");
    div.className = "menu-options";

    div.innerHTML = `
        <button onclick="menu('balance')">💰<span>Balance</span></button>
        <button onclick="menu('transfer')">💸<span>Transfer</span></button>
        <button onclick="menu('statement')">🧾<span>Statement</span></button>
        <button onclick="menu('loan')">🏠<span>Loan</span></button>

        <button onclick="menu('emi')">📊<span>EMI</span></button>
        <button onclick="menu('block')">🚫<span>Block</span></button>
        <button onclick="menu('pin')">🔐<span>PIN</span></button>
    `;

    document.getElementById("messages").appendChild(div);
}

function menu(x){

    display(x,"user");

    if(x === "balance") return checkBalance();
    if(x === "transfer") return display("Use sidebar transfer", "bot");
    if(x === "loan") return loanInfo();
    if(x === "atm") return display("ATM available 24/7", "bot");
    if(x === "emi") return calculateEMI();
    if(x === "block") return blockCard();
    if(x === "pin") return changePIN();
    if(x === "statement") return miniStatement();

    display("Option not available", "bot");
}

/* GRAPH (FIXED) */
function renderChart(){

    let ctx = document.getElementById("balanceChart");

    if(chartInstance){
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx,{
        type:'line',
        data:{
            labels: transactions.map((_,i)=>"T"+(i+1)),
            datasets:[{
                label:"Transaction Amount",
                data: transactions.map(x=>x.amt),
                borderWidth:2
            }]
        }
    });
}
function miniStatement(){

    if(transactions.length === 0){
        display("No transactions yet", "bot");
        return;
    }

    let last = transactions.slice(-5);

    let msg = "🧾 Last Transactions:\n";

    last.forEach(t => {
        msg += `${t.type} ₹${t.amt} at ${t.time}\n`;
    });

    display(msg, "bot");
}
/* LOGOUT */
function logout(){
    localStorage.clear();
    location.href="login.html";
}