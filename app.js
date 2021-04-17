const express = require('express');
const chalk = require('chalk');
const app = express();
const PORT = 3002;
app.use(express.json());//now express can understand JSON 
const {displayAllAccounts, addNewAccount, changeAccountStatus, displayOneAccount, updateAccountDetails, deleteOneAcount, AddDeposit, withdrawMoney, updateAccountCredit, transferMoney, } = require("./utils");
const entity = 'account';

//set credit to account
app.put(`/api/accounts/withdraw/:ppID/:amount`, (req, res)=>{
 const {ppID,amount} = req.params;
 // const {cash,credit} = req.body; 
 console.log(ppID,amount);
 const withdrawmoney = withdrawMoney(ppID, amount);
 res.status(200).send(withdrawmoney);
});

//set credit to account
app.put(`/api/accounts/credit/:ppID`, (req, res)=>{
 const {ppID} = req.params;
 const {credit} =req.body;
 const setCredit = updateAccountCredit(ppID, credit);
 res.status(200).send(setCredit);
});

//add deposit to account
app.put(`/api/accounts/deposit/:ppID`, (req, res)=>{
 const {ppID} = req.params;
 const {cash} =req.body;
 const addcash = AddDeposit(ppID, cash);
 res.status(200).send(addcash);
});

//toggle account status by name
app.put(`/api/accounts/togglestatus/:name`, (req, res)=>{
 const {name} = req.params;
 const {IsActive} = req.body;
 console.log('put IsActive', IsActive);
 const toggleAccountStatus = changeAccountStatus(name, IsActive);
 res.status(200).send(toggleAccountStatus);
});

//delete an account
app.delete(`/api/accounts/delete/:name`, (req, res)=>{
 const {name} = req.params;
 const deleteAccount = deleteOneAcount(name);
 res.status(200).send(deleteAccount);
});

//create one record
app.post(`/api/accounts/create`, (req, res)=>{
 //console.log('req.body',req.body,'this is from Post to create new record');
 try{
  const createRecord = addNewAccount(req.body);
  res.status(201).send(createRecord); //status 201 means successfully created an object by default 
 }catch(error){
  console.log('could not create new record');
  res.status(400).send({error: message});//whenever the user gives you bad data at the client you 
                                         //want to send a 400 error because that means there's something wrong with the
                                         //user input and not something wrong with your server
 }
});

//retrieve All Accounts
app.get(`/api/${entity}s/allaccounts`, (req, res)=>{
 const allAccount = displayAllAccounts();
 res.status(200).send(allAccount);
});

app.listen(PORT, ()=>console.log(`server listening to port `+ chalk.blue.underline.bold(`${PORT}`)));


/**
 * localhost:3002/api/accounts
 * id
 * ppID
 * name
 * cash
 * credit
 * IsActive
 */
