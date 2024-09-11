const jsSHA = require("jssha");
const rdm = require("secure-random");
const readlineSync = require('readline-sync');
const AsciiTable = require('ascii-table');

let input = process.argv.slice(2);
let n = input.length;
let hmac = "";

verifyInput();
let seed = generateSeed();
let computerChoice = calculateHMAC(input.length);
let playerChoice = showMenu();
console.log("Computer's move: ", computerChoice);
let win = game(playerChoice, computerChoice);
switch(win){
    case "Draw":
     console.log("DRAW!");
     break;
    case playerChoice:
        console.log("PLAYER WIN!");
        break;
    case computerChoice:
        console.log("COMPUTER WIN!");
        break;
    default:
        break;
}
console.log("HMAC key; ", seed);
console.log("Thank you for playing");

function verifyInput() {
    if (input.length >= 3 && input.length % 2 != 0) {
        let conjunto = new Set(input);
        if (conjunto.size !== input.length) {
            console.error("Repeating elements");
            process.exit(1);
        }
    }
    else if (input.length >= 3 && input.length % 2 == 0) {
        console.error("Pair of elements")
        process.exit(1);
    }
    else {
        if (input.length < 3) {
            console.error("Not enough elements");
            process.exit(1);
        }
    }
    return;}
function generateSeed() {
    let bytes = rdm.randomArray(32);
    let seedString = "";
    for (i = 0; i < bytes.length; i++) {
        seedString += bytes[i].toString(16);
    }
    return seedString;}
function calculateHMAC(x) {
    let randomChoice = Math.floor(Math.random() * x);
    selected = input[randomChoice];
    let hmacInput = selected;
    hmacInput += seed;
    const shaObjto = new jsSHA("SHA3-256", "TEXT", { encoding: "UTF8" });
    shaObjto.update(hmacInput);
    hmac = shaObjto.getHash("HEX");
    return selected;}
function showMenu() {
    let move = "";
    console.log("HMAC: ", hmac);
    console.log("Select your move:");
    for (i = 0; i < input.length; i++) {
        let j = i + 1;
        console.log(j.toString(), "-", input[i]);
    }
    console.log("0 - exit");
    console.log("? - help");
    const answer = readlineSync.question("Please type your move: ");
    let choose = parseInt(answer);
    if (choose <= input.length && choose > 0) {
        move = input[choose - 1];
        console.log("You select: ", move);
    }
    else if (choose === 0) {
        console.log("Thank you for playing");
        process.exit();
    }
    else if (answer === "?") {
        showHelp();
        showMenu();
    }
    else {
        console.log("Error! you typed and invalid option: ", answer);
        process.exit();
    }
    return move;}
function game(x, y) {
        let player = input.indexOf(x);
        let computer = input.indexOf(y);
        winner = (computer - player + n) % n;
        if (player === computer) {
            return "Draw";
        } else if (winner >= 1 && winner <= Math.floor(n / 2)) {
            return x;
        } else {
            return y;
        }
    }
function showHelp(){
    let heading = input.slice(0);
    heading.unshift('Movements ->');
    let table = new AsciiTable('Game dominance');
    table.setHeading(heading)
    for(i=0;i<input.length;i++){
        let movement1 = input[i];
        let row = [input[i]];
        for(j=0;j<input.length;j++){
            let movement2 = input[j];
            let winner = game(movement1,movement2);
            row.push(winner);
        }
    table.addRow(row);
    }
    console.log(table.toString());
}