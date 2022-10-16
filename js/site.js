// Total Monthly Payment = (amountLoaned) * (rate / 1200) / (1 - (1 + rate / 1200) ^ (-NumberOfMonths) )
// Remaining Balance = amountOfLoan
// Interest Payment = prevRemainingBal * rate / 1200
// Principal Payment = totalMonthlyPayment - InterestPayment
// Remaining Balance = prevRemainingBal - principalPayment

// get values from document
function getValues() {
    // get the numbers
    document.getElementById("monthlyPayments").innerHTML = 0; // initialize to 0
    let loanAmount = document.getElementById("loanAmount").value;
    let termInMonths = document.getElementById("termInMonths").value;
    let interestRate = document.getElementById("interestRate").value;

    // convert to actual numbers
    loanAmount = parseFloat(loanAmount);
    termInMonths = parseInt(termInMonths);
    interestRate = parseFloat(interestRate);

    // validate inputs
    // 
    if ((!isNaN(loanAmount) && !isNaN(termInMonths) && !isNaN(interestRate)) && (loanAmount > 0 && termInMonths > 0 && interestRate > 0)) {
        // store monthly payment result
        let monthlyPaymentResult = calculateTotalMonthlyPayment(loanAmount, termInMonths, interestRate);
        
        let remainingBal = loanAmount; // the remaining balance
        let interestPaymentResult = 0;
        let principalPaymentResult = 0;
        let totalInterestResult = 0;
        let totalCostResult = 0;
        let totalInterestPaymentMonthlyResult = 0;

        // store the calculated values into the appropriate array
        let interestPaymentArr = [];
        let principalPaymentArr = [];
        let remainingBalArr = [];
        let totalInterestPaymentArr = [];

        // loop until term given, calculate new values each month
        for (let i = 1; i <= termInMonths; i++) {
            // store monthly interest payment result
            interestPaymentResult = calculateInterestPayment(remainingBal, interestRate);
            interestPaymentArr.push(interestPaymentResult);

            // store monthly principal payment result
            principalPaymentResult = calculatePrincipalPayment(monthlyPaymentResult, interestPaymentResult);
            principalPaymentArr.push(principalPaymentResult);

            // store new remaining balance
            remainingBal = calculateMonthlyRemainingBalance(remainingBal, principalPaymentResult);
            remainingBalArr.push(remainingBal);

            // store total interest monthly result
            totalInterestPaymentMonthlyResult = totalInterestPaymentMonthlyResult + interestPaymentResult;
            totalInterestPaymentArr.push(totalInterestPaymentMonthlyResult);
        }
        
        // store total interest result
        totalInterestResult = calculateTotalInterest(interestPaymentArr, termInMonths);

        // store total cost result
        totalCostResult = calculateTotalCost(loanAmount, totalInterestResult);

        // display to web page
        document.getElementById("monthlyPayments").innerHTML = monthlyPaymentResult.toLocaleString("en-us", {style: "currency", currency: "USD"} );

        document.getElementById("totalPrincipal").innerHTML = loanAmount.toLocaleString("en-us", {style: "currency", currency: "USD"} );

        document.getElementById("totalInterest").innerHTML = totalInterestResult.toLocaleString("en-us", {style: "currency", currency: "USD"} );

        document.getElementById("totalCost").innerHTML = totalCostResult.toLocaleString("en-us", {style: "currency", currency: "USD"} );

        displayAmortLoanData(termInMonths, monthlyPaymentResult, principalPaymentArr, interestPaymentArr, totalInterestPaymentArr, remainingBalArr);
    } else {
        Swal.fire({
            icon: "error",
            title: "Input Error",
            text: "Values must be positive numbers to run this app",
        });
    }
}

// calculate total monthly payment
function calculateTotalMonthlyPayment(loanAmount, termInMonths, interestRate) {
    let totalMonthlyPayment = 0;
    
    totalMonthlyPayment = (loanAmount) * (interestRate / 1200) / (1 - Math.pow((1 + interestRate / 1200), -termInMonths));

    return totalMonthlyPayment;
}

// calculate monthly interest payment
function calculateInterestPayment(remainingBal, interestRate) {
    let interestPayment = 0;

    interestPayment = remainingBal * (interestRate / 1200);
        
    return interestPayment;
}

// calculate monthly principal payment
function calculatePrincipalPayment(monthlyPaymentResult, interestPaymentResult) {
    let principalPayment = 0;

    principalPayment = monthlyPaymentResult - interestPaymentResult;

    return principalPayment;
}

// calculate monthly remaining balance
function calculateMonthlyRemainingBalance(remainingBal, principalPaymentResult) {
    let monthlyBal = 0;

    monthlyBal = remainingBal - principalPaymentResult;
    
    return monthlyBal;
}

// calculate total interest of all months
function calculateTotalInterest(interestPaymentArr, termInMonths) {
    let totalInterest = 0;

    for (let i = 1; i <= termInMonths; i++) {
        totalInterest += interestPaymentArr[i - 1];
    }
    
    return totalInterest;
}

// calculate total cost of loan
function calculateTotalCost(loanAmount, totalInterestResult) {
    let totalCost = 0;

    totalCost = loanAmount + totalInterestResult;

    return totalCost;
}

// display the data in a table
function displayAmortLoanData(termInMonths, monthlyPaymentResult, principalPaymentArr, interestPaymentArr, totalInterestPaymentArr, remainingBalArr) {
    let templateRows = ''; // template for a row
    let className = 'rowData';

    // loop through the term given
    for (let i = 1; i <= termInMonths; i++) {
        let interestPayment = interestPaymentArr[i - 1];
        let totalInterestPaymentMonthly = totalInterestPaymentArr[i - 1];
        let principalPayment = principalPaymentArr[i - 1];
        let remainingBal = remainingBalArr[i - 1];
        
        // template for a row
        templateRows += '<tr>';

        // display each row
        templateRows += `<td class="${className}"> ${i} </td>`;
        templateRows += `<td> ${monthlyPaymentResult.toLocaleString('en-us', {style: 'currency', currency: 'USD'} )} </td>`;
        templateRows += `<td> ${principalPayment.toLocaleString('en-us', {style: 'currency', currency: 'USD'} )} </td>`;
        templateRows += `<td> ${interestPayment.toLocaleString('en-us', {style: 'currency', currency: 'USD'} )} </td>`;
        templateRows += `<td> ${totalInterestPaymentMonthly.toLocaleString('en-us', {style: 'currency', currency: 'USD'} )} </td>`;
        templateRows += `<td class="${className}"> ${remainingBal.toLocaleString('en-us', {style: 'currency', currency: 'USD'} )} </td>`;

        templateRows += '</tr>';
    }
    
    // innerHTML points to the space between tbody tag
    document.getElementById('amortBody').innerHTML = templateRows;
}

