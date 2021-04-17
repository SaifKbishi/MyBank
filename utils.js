const chalk = require('chalk');
const fs = require('fs');
const DB = './db/bank.json'
const entity = 'account';

//try{}catch(error){console.log(`Could not toggle Account status: ${error}`)}
//if(){}else{}
//if(accountFound.IsActive){}else{console.log('This account is '+ chalk.red('NOT ACTIVE')+', you cannot perform any task to it while it is still '+ chalk.red('NOT ACTIVE'))}

const transferMoney = ()=>{
 console.log('trying to transfer Money');
}//transferMoney

const withdrawMoney =(ppID, amountToWithdraw)=>{
 console.log('trying to withdraw Money');
 const accounts = displayAllAccounts();
 const accountFound = findAccountByPassPortID(accounts, ppID);
 const accountCash = accountFound.cash;
 const accountCredit = accountFound.credit;
 if(accountFound.IsActive){
  if(accountCash + accountCredit >= amountToWithdraw){
   try{
    if(accountFound){
     accountFound.cash = accountFound.cash - amountToWithdraw;
     console.log(`Account name ${ppID} new balance is: `,accountFound.cash );
     saveAccounts(accounts);
    }else{
     console.log(`Withdraw, Account with` +chalk.green(`PassPortID=${ppID}`)+`, was not found.`);
    }
   }catch(error){console.log(`Could not withdraw money from this account: ${error}`)}
  }else{
   console.log(`The amount you are trying to withdraw is greater than your Cash & Credit `+chalk.blue(`${accountCash + accountCredit}$`)+`, you can to ask to withdraw for equal or less than: ${accountCash + accountCredit}$`)
  }
 }else{console.log('This account is '+ chalk.red('NOT ACTIVE')+', you cannot perform any task to it while it is still '+ chalk.red('NOT ACTIVE'))} 
}//withdrawMoney

const updateAccountCredit = (ppID=0,amount=0)=>{
 console.log('trying to set Credit');
 console.log('11:',ppID ,' $ ', amount);
 const accounts = displayAllAccounts();
 const accountFound = findAccountByPassPortID(accounts, ppID);
 if(accountFound.IsActive){
  if(amount > 0){  
   try{
    if(accountFound){
     console.log('17 current credit',accountFound.credit );
     accountFound.credit = accountFound.credit+amount;
     console.log(`Account name ${ppID} new credit is: `,accountFound.credit );
     saveAccounts(accounts);
    }else{
     console.log(`Credit, Account with` +chalk.green(`PassPortID=${ppID}`)+`, was not found.`);
    }
   }catch(error){console.log(`Could not set the credit for this account: ${error}`)}
  }else{
   console.log(`The amount you are trying to add is equal or less than 0, nothing will be changed.`)
  }
 }else{console.log('This account is '+ chalk.red('NOT ACTIVE')+', you cannot perform any task to it while it is still '+ chalk.red('NOT ACTIVE'))} 
}//updateAccountCredit

const AddDeposit =(ppID=0,amount=0)=>{
 console.log('trying to add Deposit');
 const accounts = displayAllAccounts();
 const accountFound=findAccountByPassPortID(accounts, ppID);
 if(accountFound.IsActive){
  if(amount > 0 ){  
   try{  
    if(accountFound){
     accountFound.cash = accountFound.cash+amount;
     console.log(`Account name `+ chalk.green(`${ppID}`) +` new balance is: `,accountFound.cash );
     saveAccounts(accounts);
    }else{
     console.log(`Deposit, Account with ` +chalk.green(`PassPortID=${ppID}`)+`, was not found.`);
    }
   }catch(error){console.log(`Could not perform deposit to Account: ${error}`)}
  }else{
   console.log(`The amount you are trying to add is equal or less than 0, nothing will be executed.`)
  }
 }else{console.log('This account is '+ chalk.red('NOT ACTIVE')+', you cannot perform any task to it while it is still '+ chalk.red('NOT ACTIVE'))} 
}//AddDeposit

const changeAccountStatus = (name, IsActive)=>{
 console.log('trying to TOGGLE account status');
 // console.log('10', name, IsActive)
 const accounts = displayAllAccounts();
 let accountFound=findAccountByNameOrppID(accounts, name, IsActive);
 try{  
  if(accountFound){
   console.log('14 current stauts',accountFound.IsActive );
   accountFound.IsActive = !accountFound.IsActive;
   console.log(`Account name ${name} status was modified: `,accountFound.IsActive );
   saveAccounts(accounts);
  }else{
   console.log(`Account with name=${name}, was not found.`);
  }
 }catch(error){console.log(`Could not toggle Account status: ${error}`)}
}//changeAccountStatus

const findAccountByPassPortID = (accounts, ppID)=>{
 console.log(ppID);
 const accountFound = accounts.find((account)=>{return account.ppID == ppID;});
 if(accountFound){//returns undefined if account is not found else  returns the account
  return accountFound;
 }else{
  console.log('Account was not found ');
  return false;
 }
}//findAccountByPassPortID

const findAccountByNameOrppID = (accounts, name='', ppID=0)=>{
 console.log(name, ppID);
 let accountFound;
 if(accountFound = accounts.find((account)=>{return account.name == name;}) )
 {
  //console.log('accountFound',accountFound);
  return accountFound;//returns undefined if account is not found else  returns the accoutn
 }
 else if(accountFound = accounts.find((account)=>{return account.ppID == ppID;})) //this is a random number
 {
  //console.log('accountFound',accountFound);
  return accountFound;//returns undefined if account is not found else  returns the accoutn
 }
}//findAccountByNameOrppID

const addNewAccount = (argv)=>{//newly created accounts are Active be defaut
 console.log('trying to add new account');
 try{
  const accounts = displayAllAccounts();
  const accountExists = findAccountByNameOrppID(accounts, argv.name, argv.ppID); 
  if(!accountExists){
   console.log(chalk.green(`Account with Name=${argv.name} will be created`));
   accounts.push({
    id: argv.id,
    ppID: argv.ppID,
    name: argv.name, 
    cash: argv.cash,
    credit: argv.credit, 
    IsActive: argv.IsActive
   });
   saveAccounts(accounts);
  }else{
   console.log(`Account with PassPortID=`+ chalk.red(argv.ppID) +` or Name=`+ chalk.red(argv.name) +` already exits. \nAnd will not be created`);
  }
 }catch(error){console.log(`Could not create new Account: ${error}`)}
}//addNewAccount

const deleteOneAcount = (name) =>{
 console.log('trying to DELETE one Account');
 const accounts = displayAllAccounts();
 const findAccount = accounts.find((account)=>{
  return account.name = name;
 });
 if(findAccount){
  const filteredAccount = accounts.filter((account)=>{
   return account.name !== name;
  });
  saveAccounts(filteredAccount);
 }else{
  console.log(`Account with name=${name}, could not be found. \nAnd cannot be deleted!`)
 }
}//deleteOneAcount

const saveAccounts =(accounts)=>{
 const dataJSON = JSON.stringify(accounts);
 fs.writeFileSync(`${DB}`, dataJSON);
}//saveAccounts

const displayAllAccounts = ()=>{
 console.log(chalk.green('Retriveing all accounts in the Bank'));
 try{
  const dataBuffer = fs.readFileSync(`${DB}`);
  const dataJSON = dataBuffer.toString();
  return JSON.parse(dataJSON);
 }catch(error){
  console.log('No Accounts to return')
  return [];
 }
}//displayAllAccounts

module.exports ={
 displayAllAccounts, 
 addNewAccount, 
 changeAccountStatus, 
 // displayOneAccount, 
 // updateAccountDetails, 
 deleteOneAcount, 
 AddDeposit, 
 withdrawMoney, 
 updateAccountCredit, 
 transferMoney,
};
