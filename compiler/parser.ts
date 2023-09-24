import { Statement, Program, Expression, BinaryExpression, NumericLiteral, Identifier } from "./ast.ts";
import { tokenize, Token, TokenType } from "./lexer.ts";


export default class Parser {
    private tokens: Token[] = [];

    // not end of file
    private not_eof(): boolean {
        return this.tokens[0].type != TokenType.EOF;
    }

    // returns current token
    private current_token() {
        return this.tokens[0] as Token;
    }

    // removes current token and returns value of previous token
    private eat() {
        const previous = this.tokens.shift() as Token;
        return previous;
    }

    private expect(type: TokenType, err: any) {
        const previous = this.tokens.shift() as Token;
        if (!previous || previous.type != type) {
            console.log("Parser Error:\n", err, previous, "Expecting: ", type)
            Deno.exit();
        }

        return previous;
    }

    public produceAST(sourceCode: string): Program {
        this.tokens = tokenize(sourceCode);
        const program: Program = {
            kind: "Program",
            body: []
        }

        // parse until end of file
        while (this.not_eof()) {
            program.body.push(this.parse_statement())
        }

        return program;
    }

    private parse_statement(): Statement {
        // skip to parse_expression
        return this.parse_expression();
    }

    private parse_expression(): Expression {
        // return this.parse_primary_expression();
        return this.parse_additive_expression();
    }

    // ex: (10 + 5) - 4
    private parse_additive_expression(): Expression {
        let left = this.parse_multiplicitave_expression();

        // parse operator
        while (this.current_token().value == "+" || this.current_token().value == "-") {
            const operator = this.eat().value;
            const right = this.parse_multiplicitave_expression();
            left = {
                kind: "BinaryExpression",
                left,
                right,
                operator
            } as BinaryExpression
        }

        return left;
    }

    private parse_multiplicitave_expression(): Expression {
        let left = this.parse_primary_expression();

        // parse operator
        while (this.current_token().value == "/" || this.current_token().value == "*" || this.current_token().value == "%") {
            const operator = this.eat().value;
            const right = this.parse_primary_expression();
            left = {
                kind: "BinaryExpression",
                left,
                right,
                operator
            } as BinaryExpression
        }

        return left;
    }



    // Orders os prescidence

    // Assignment Expression
    // Member Expression
    // Function Call
    // Logical Expression
    // Comparision Expression
    // Addictive Expression
    // Multiplicitave Expression
    // Unary Expression
    // Primary Expression


    private parse_primary_expression(): Expression {
        const token = this.current_token().type;

        switch (token) {
            case TokenType.Indentifier:
                return { kind: "Identifier", symbol: this.eat().value } as Identifier;

            case TokenType.Number:
                return { kind: "NumericLiteral", value: parseFloat(this.eat().value) } as NumericLiteral;

            case TokenType.OpenParenthesis: {
                this.eat(); // remove the opne parenthesis and get value
                const value = this.parse_expression();
                this.expect(TokenType.CloseParenthesis, "Unexpected token found inside parenthesised expression. Expected closing parenthesis",); // closing parenthesis
                return value;
            }

            default:
                console.error("Unexpected token found during parsing!", this.current_token())
                // @ts-ignore
                return Deno.exit(1);
        }
    }
}