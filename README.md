# Metronome.io Site with Auction Board

This project is composed by the main Metronome webpage and an application called "Metronome Auction Board" to operate with the Metronome Auction.

## Build

Clone the auction board
```bash
$ git clone https://github.com/MetronomeToken/metronome-auction-brd
```

Then install npm dependencies and build the project
```bash
$  npm install
$  npm run build
```

Copy the `/build` folder to a new folder on this project with the name `./auction-build`.
Now you must update the references installing the project dependences and runing the `integration.js` script, 
```bash
$  mv ${your/path/to/metronome-auction-board/}/build ${your/path/to/metronome.io/}/auction-build
$  npm install 
$  node integration.js
```

Finally, you will have ready to run the whole site with the auction board working
```bash
$  npm start

> metronome.io@1.0.0 start /Users/batman/projects/metronome.io
> serve .

   ┌───────────────────────────────────────────────────┐
   │                                                   │
   │   Serving!                                        │
   │                                                   │
   │   - Local:            http://localhost:5000       │
   │   - On Your Network:  http://192.168.1.104:5000   │
   │                                                   │
   │   Copied local address to clipboard!              │
   │                                                   │
   └───────────────────────────────────────────────────┘
```