// [LetToken, IndentifierToken, EqualsToken, NumberToken]

export enum TokenType {
    // literal types
    Number,
    Indentifier,

    // keywords
    Let,

    // grouping operators
    Equals,
    OpenParenthesis, CloseParenthesis,
    BinaryOperator,
    // eof - end of file
    EOF
}


export interface Token {
    value: string;
    type: TokenType;
}

export const KEYWORDS: Record<string, TokenType> = {
    "let": TokenType.Let
}


// returns token
function token(value: string = "", type: TokenType): Token {
    return { value, type }
}

// checks if source is alphabetic
function isAlphabetic(src: string) {
    return src.toUpperCase() != src.toLowerCase()
}

function isInteger(str: string) {
    const char = str.charCodeAt(0);

    // returns unicode value for 0 and 9
    const bounds = ['0'.charCodeAt(0), '9'.charCodeAt(0)];

    // checks if char is between 0 and 9
    return (char >= bounds[0] && char <= bounds[1]);
}

function isSkippable(src: string) {
    return src == " " || src == "\t" || src == "\n";
}


// tokenize source code
export function tokenize(sourceCode: string): Token[] {
    const tokens = new Array<Token>();
    const src = sourceCode.split("");

    // Build each token until file ends
    while (src.length > 0) {
        if (src[0] == "(") {
            // value removed by src.shift() is passed as an argument to token()
            tokens.push(token(src.shift(), TokenType.OpenParenthesis));

        } else if (src[0] == ")") {
            tokens.push(token(src.shift(), TokenType.CloseParenthesis));

        } else if (src[0] == "+" || src[0] == "-" || src[0] == "*" || src[0] == "/") {
            tokens.push(token(src.shift(), TokenType.BinaryOperator));

        } else if (src[0] == "=") {
            tokens.push(token(src.shift(), TokenType.Equals));

        } else {
            // handle multi-character tokens

            // build integers
            if (isInteger(src[0])) {
                let num = "";
                while (src.length > 0 && isInteger(src[0])) {
                    num += src.shift(); // adds to num and removes first element
                }
                tokens.push(token(num, TokenType.Number))

                // build alaphabetic characters
            } else if (isAlphabetic(src[0])) {
                let ident = "";
                while (src.length > 0 && isAlphabetic(src[0])) {
                    ident += src.shift(); // adds to num and removes first element
                }

                // check for reserved keywords
                const reserved = KEYWORDS[ident];
                if (reserved === undefined) {
                    tokens.push(token(ident, TokenType.Indentifier))
                } else {
                    tokens.push(token(ident, reserved))
                }

                // skip characters
            } else if (isSkippable(src[0])) {
                src.shift();

            } else {
                console.log(`Unknown token ${src[0]}`);
                Deno.exit(1);
            }

        }
    }

    tokens.push({ type: TokenType.EOF, value: "EndOfFile" })
    return tokens;
};



// testing code
// const source = await Deno.readTextFile("./test.txt");

// // start timer for performance testing
// const t0 = performance.now();

// for (const token of tokenize(source)) {
//     console.log(token);
// };

// // end timer for performance testing
// const t1 = performance.now();
// console.log(`Tokenized in ${(t1 - t0) / 1000}s`);
