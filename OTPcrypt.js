// Put all valid characters into this array. Any character not part of this array will not get encrypted.
const alpha = [' ', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', ',', '!','?','&','+','-',':',';','(',')','/','\\','>','#','_','/'];
const groupLen = 16; // number of characters per group
const groupNumb = 30; // number of groups per key

// also, lets have one version of the space array without the special stuff... for AESTETICS
const spacelessAlpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

function encrypt(encryptionKey, input) {
    var keyArray = encryptionKey.split('');
    var output = "";

    input = addSalt(input);

    for (var i = 0; i < input.length; ++i) {
        // special characters not part of the alphabet array are not encrypted.
        // So to maker sure the rest of the encryption does not break they are simply passed trough to the output unencrypted.
        if (alpha.indexOf(input[i]) == -1) {
            output += input[i];
        } else {
            var curKey = keyArray[i%encryptionKey.length];
            var curCharIndex = (alpha.indexOf(input[i]) + alpha.indexOf(curKey))%alpha.length;
            output += alpha[curCharIndex];
        }
    };

    return output;
}

function decrypt(decryptionKey, input, salt) {
    var keyArray = decryptionKey.split('');
    var output = "";

    for (var i = 0; i < input.length; ++i) {
        // special characters not part of the alphabet array are not encrypted
        // So to maker sure the rest of the encryption does not break they are simply passed trough to the output unencrypted.
        if (alpha.indexOf(input[i]) == -1) {
            output += input[i];
        } else {
            var curKey = keyArray[i%decryptionKey.length];
            var curCharIndex = (alpha.indexOf(input[i]) - alpha.indexOf(curKey));
            // to lazy to do better handling of negative index numbers...
            var curCharIndex = curCharIndex < 0 ? alpha.length + curCharIndex : curCharIndex;
            output += alpha[curCharIndex];
        }
    };
    return removeSalt(output);
}

function addSalt(unsaltedString){
    // time to add some salt! (yum)
    // add random(ish) char from the aplhabet array to the end of the input.
    var c = alpha[Math.floor(Math.random() * alpha.length)];
    unsaltedString += c;

    // add n number of random(ish) characters at the start of the input.
    // where n is the index of c in the alphabet array.
    for (var j = 0; j < alpha.indexOf(c); ++j) {
        unsaltedString = alpha[Math.floor(Math.random() * alpha.length)] + unsaltedString;
    };
    return unsaltedString;
}

function removeSalt(saltedString){
    // time to remove some salt! (thats a lot o sodium)
    // find integer n at the end of the input
    var c = saltedString.slice(-1);
    var n = alpha.indexOf(c);

    // remove n number of characters at the start of the input.
    var unsaltedOutput = saltedString.substring(n);
    unsaltedOutput = unsaltedOutput.substring(0, unsaltedOutput.length-1);

    // Unsalted output may get a lenght of 0 an invalid c is used.
    // If so just return the garbled output and pretend like it works as intended...
    return unsaltedOutput == "" ? saltedString : unsaltedOutput;
}


function generatepsuedorandomOTPkey(){

    var keystring = "";
    for (var y = 0; y < groupNumb; ++y) {
        for (var z = 0; z < groupLen; ++z) {
            keystring += spacelessAlpha[Math.floor(Math.random() * spacelessAlpha.length)];
        }
        if (y < groupNumb -1)
            keystring += " "
    }
    return keystring;

}

// the seed must be an array of numbers, and a verry large one.
// yeah yeah I know, it requires a crazy amount of indata, but this way you can play arround with the seed...
function generateOTPkeyFromSeed(seedArray){

    var keystring = "";

    // fail if the array of numbers is not at least as big as the number of random characters needed
    if (seedArray.length < groupLen * groupNumb) {
        return null;
    }

    for (var x = 0; x < groupNumb * groupLen; x++) {
        keystring += spacelessAlpha[seedArray[x]%spacelessAlpha.length]
        if (x%groupLen == groupLen-1) {
            keystring += " "
        }
    }

    return keystring;
}
