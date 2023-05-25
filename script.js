'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
// ----------------------------------------------
const displayMovement = function (account, sort = false) {
  containerMovements.innerHTML = '';
  // using slice method to create a copy
  const movs = sort ? account.slice().sort((a, b) => a - b) : account;
  console.log(movs);
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov}</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// displayMovement(account1.movements);

const createUserName = function (accounts) {
  accounts.forEach(function (user) {
    user.username = user.owner
      .toUpperCase()
      .split(' ')
      .map(letter => letter[0])
      .join('');
    // return username;
  });
};
createUserName(accounts);
// console.log(accounts);
// ---------------------------

const calcPrintBalance = function (account) {
  account.balance = account.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${account.balance}€`;
};

// calcPrintBalance(account1);

// maximum value
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const firstWithdrawal = movements.find(mov => mov < 0);
console.log(firstWithdrawal);
// const max = movements.reduce((acc, cur) => {
//   if (acc > cur) return acc;
//   else return cur;
// }, movements[0]);
// console.log(max);

// labelSumIn
const displaySummary = function (account) {
  const sum = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);
  // return sum
  labelSumIn.textContent = `${sum}€`;

  const Nsum = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = `${Math.abs(Nsum)}€`;

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * 1.2) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, cur) => acc + cur, 0);
  labelSumInterest.textContent = `${interest}€`;
};

let currentAccount;
const updateAccount = function (account) {
  displaySummary(account);
  calcPrintBalance(account);
  displayMovement(account.movements);
};

btnLogin.addEventListener('click', function (e) {
  e.preventDefault;
  console.log('login');
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount.pin === Number(inputLoginPin.value)) {
    console.log('login');
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    updateAccount(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault;
  const amount = Number(inputTransferAmount.value);
  const reciverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  // console.log(amount, reciverAcc);
  if (
    amount > 0 &&
    // check receive account does exist
    reciverAcc &&
    currentAccount.balance >= amount &&
    reciverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    reciverAcc.movements.push(amount);
    updateAccount(currentAccount);
    // updateAccount(reciverAcc);
  }
});
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  // console.log(currentAccount);
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

// indexOf only search the value in an array return true or false
// findindex can be used complex condition like up method
// -----------------------------------------
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    updateAccount(currentAccount);
  }
  inputLoanAmount.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  // console.log(mov);
  displayMovement(currentAccount.movements, !sorted);
  sorted = !sorted;
});

// ------------Some-----------------------
console.log(movements);
// check for equality
console.log(movements.includes(-130));
movements.some(mov => mov > 0);

console.log(movements.some(mov => mov === -130));

// check for conditon, if there is any value inside the array will return true
const anyDeposits = movements.some(mov => mov > 1500);
console.log(anyDeposits);
// const Testdata = [5, 2, 4, 1, 15, 8, 3];
// -------------Every------------------------
console.log(movements.every(mov => mov > 0));
console.log(account4.movements.every(mov => mov > 0));
// separate callback

// You also can create three function and change the condition, which can print out opposite result
const deposit = mov => mov < 0;
console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));

// ----------flat and map flat---------------
const arr = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

console.log(arr.flat());

const Narr = [
  [[1, 2], 3],
  [4, [5, 6]],
  [[7, 8], 9],
];
// the number mean how deep you want to flat your array
console.log(Narr.flat(2));

// The map method means from an object retrieve a value and push to creat a new array
// const accountMovements = accounts.map(acc => acc.movements);
// const allMovements = accountMovements.flat();
// const addup = allMovements.reduce((acc, cur) => acc + cur, 0);

// console.log(accountMovements);
// console.log(allMovements);
// console.log(addup);
// flat
const overalBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, cur) => acc + cur, 0);
console.log(overalBalance);
// flatmap() flatmap only go one level deepm if you want to go deeper have to use origin flat method
const overalBalance1 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, cur) => acc + cur, 0);
console.log(overalBalance1);
// -----------sort-------------------------

const owner = ['Benji', 'joe', 'David', 'Becky'];
console.log(owner.sort());
// return alphabetical
// ---------------------
// console.log(movements.sort());
// a,b means the current value and the next value
// return < 0, a,b (keep order)
// retrun > 0, b,a (switch order)
console.log(movements.sort());
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (b > a) return -1;
// });
movements.sort((a, b) => a - b);
console.log(movements);
movements.sort((a, b) => b - a);
console.log(movements);

// ----------new array-------------

const arr1 = [1, 5, 6, 5, 41, 1, 1, 2, 3, 3];
console.log(new Array(1, 2, 3, 4, 5, 6, 7));

const x = new Array(7);
console.log(x.fill(1, 3, 5));

arr1.fill(55, 2, 6);
console.log(arr1);
// Array.from
const y = Array.from({ length: 7 }, () => 1);
console.log(y);
const z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(z);

// const q = Array.from({ length: 100 }, (_, i) => i + 2);
// console.log(q);

labelBalance.addEventListener('click', function () {
  const movementUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );
  console.log(movementUI);
});

// const movementUI2 = [...document.querySelectorAll('.movements__value')];
// console.log(movementUI2);

// console.log(x.map(() => 5));

// // console.log(accounts);
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const account = accounts.find(acc => acc.owner === 'Steven Thomas Williams');
// console.log(account);

// for (const account1 of accounts) {
//   if (account1.owner === 'Steven Thomas Williams') {
//     console.log(account1);
//   }
// }

// new value that function produce need to be returned, however adjustment from an object doesn't need return.Take an example of map, map simply copy an value and make adjustment, which is produce a new value by copy one, so it needs add return.

// ----------------------------------------
// const deposits = movements.filter(function (mov) {
//   return mov > 0;
// });

// const withdraw = movements.filter(mov => mov < 0);
// console.log(withdraw);

// const balance = movements.reduce(function (acc, cur, i, arr) {
//   console.log(`Iteration ${i}: ${acc}`);
//   console.log(`${acc},${cur},${i}`);
//   return acc + cur;
// }, 0);
// console.log(balance);

// let balance2 = 0;
// for (const mov of movements) {
//   balance2 += mov;
// }
// console.log(balance2);

// const balance3 = movements.reduce((acc, cur) => acc + cur, 0);
// console.log(balance3);
// const [deposit, withdraw] = movements.filter(function (mov) {
//   if (mov > 0) {
//     return deposit;
//   } else {
//     return withdraw;
//   }
// });

// ---------------------------------------
// const movementDescription = movements.map(function (mov, i) {
//   if (mov > 0) {
//     return `Movement ${i + 1}: You deposited ${mov}`;
//   } else {
//     return `Movement ${i + 1}:You withdraw ${Math.abs(mov)}`;
//   }
// });

// console.log(movementDescription);

// const eurToUsd = 1.1;
// // const movementsUSD = movements.map(function (mov) {
// //   return mov * eurToUsd;
// // });
// const movementsUSD1 = movements.map(mov => mov * eurToUsd);
// console.log(movementsUSD1);

// const euroToUSD = movements
//   .filter(mov => mov > 0)
//   .map(mov => mov * eurToUsd)
//   .reduce((acc, cur) => acc + cur, 0);

// console.log(euroToUSD);
// // /////////////////////////////////////////////////
// const user = 'Benjamin wen';

// console.log(accounts);

// For this action we made some adjustments to an object of array, so we don't need to return

// let arr = ['a', 'b', 'v', 'c', 'w', 'e'];
// console.log(arr.slice(1, -2));
// console.log(arr.slice(2, 4));
// console.log(arr.slice(0, -1));
// console.log(arr);
// // --------------------------
// console.log(arr.splice(4));
// arr.splice(-1);
// console.log(arr);
// arr.splice(1, 2);
// console.log(arr);

// // ----------------------
// arr = ['a', 'b', 'v', 'c', 'w', 'e'];
// const arr2 = ['a', 'b', 'c', 'd', 'd', 'e'];
// console.log(arr2.reverse());
// console.log(arr2);
// // -------------
// const letters = arr.concat(arr2);
// console.log(letters);
// console.log([...arr, ...arr2]);

// console.log(letters.join(''));

// console.log(arr[0]);
// console.log(arr.at(0));
// console.log(arr[arr.length - 1]);
// console.log(arr.slice(-1)[0]);
// console.log(arr.at(-1));

// for (const [i, letter] of letters.entries()) {
//   console.log(`${letter} is the ${i + 1} letter`);
// }

// movements.forEach(function (movement, i, arr) {
//   if (movement > 0) {
//     console.log(`Movement ${i + 1} You deposited ${movement}`);
//   } else {
//     console.log(`Movement ${i + 1} you withdraw ${Math.abs(movement)}`);
//   }
// });

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });

// const currenciesUnique = new Set(['USD', 'EUR', 'GBP', 'USD', 'EUR', 'TWD']);

// console.log(currenciesUnique);
// currenciesUnique.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });

// const checkDogs = function (juliaData, kateData) {
//   const correctJuliaData = juliaData.slice(1, -2);
//   const alldogs = kateData.concat(correctJuliaData);
//   console.log(alldogs);
//   alldogs.forEach(function (o, i) {
//     const genre = o >= 3 ? 'Dog' : 'Puppy';
//     console.log(`Dog number ${i + 1} is a ${genre} and it's ${o} years old`);
//   });
// };
// checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);
// console.log('break');
// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);

// Map an array simply is copying from an array

// const dogsHumanAge = function (arr) {
//   const humanAges = arr.map(age => (age > 3 ? age * 2 : age * 4 + 16));
//   console.log(humanAges);
//   // const adults = humanAges.filter(age => age >= 18);
//   // console.log(adults);
//   const average = humanAges.reduce(
//     (acc, cur, i, arr) => acc + cur / arr.length,
//     0
//   );
//   console.log(average);
// };
// dogsHumanAge([9, 16, 6, 8, 3]);
// const dogsHumanAge = function (dogsarray) {
//   const humanAges = dogsarray.map(age => (age <= 2 ? age * 2 : age * 4 + 16));
//   console.log(humanAges);
//   const adults = humanAges.filter(age => age >= 18);
//   console.log(adults);
//   const average =
//     humanAges.reduce((acc, cur) => acc + cur, 0) / humanAges.length;
//   return average;
// };

// console.log(dogsHumanAge([5, 2, 4, 1, 15, 8, 3]));
