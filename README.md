# DappResourceRental

Decentralized Application for resource rental on a local blockchain

Steps to run the project:

Install Truffle globally:

`npm install -g truffle`

run the migrations:

`truffle migrate --reset`


Install and Start ganache:

`./ganache-2.5.4-linux-x86_64.AppImage`

Don't have ganache installed? [here](https://trufflesuite.com/docs/ganache/) are the Docs. 
Connect MetaMask with one of your local Network Accounts from ganache:

1. Install MetaMask Browser Plugin
2. Click on your Profile Icon on the top right corner
3. Click Import Account
4. Get your private key from the ganache Application on Account section by clicking on the key by the right hand side of the Address 
5. copy the private key
6. insert the private key into MetaMask

Install the dependencies

`yarn install`

Start application 

`yarn dev`

Demo:

![Demo picture of the application](demo_picture_resource_rental_dapp.png "Resource Rental DApp")

