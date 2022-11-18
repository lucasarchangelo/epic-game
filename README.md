# Whats is it and How is it work?

This is a Web3Dev Bootcamp, where we had to developer a Game on Blockchain.
This game gives you oportunity to earn money after defeat the Big boss.

To hit big boss you have to spend some amount of money, then you gain tickets for each hit you dealt to boss, when you defeat the big boss, we are going to get a random ticket and give all money spent to attack boss to the winner, than a new boss arrives and start the cycle again.

## Installation and execution

if you want to start it local, you have to:

```sh
# install ganache and truffle global
$ npm install ganache --global
$ npm install truffle --global
```


```sh
# install dependecies from Truffle folder
$ cd Truffle
$ npm i
```

```sh
# install dependecies from Client folder
$ cd Client
$ npm i
```

```sh
# start ganache local
$ cd Truffle
$ npm run start_local
```

```sh
# migrate all contracts to ganache environment
$ cd Truffle
$ cd truffle migrate
```

```sh
# start nextjs
$ cd Client
$ cd npm run dev
```


## Next steps for this project

- __Implement ChainLink to safe random word__

  I'd like to use chainlink oracle to implement a safe random word, that way, I know that anyone hacks this process.

- __Better gas spend on attack method__

  I think this method is very expensive, and I could do it better

- __Create an admin sector, it could help the owner to start new boss e change owner properties__

  I think this method is very expensive, and I could do it better
