import Parser from "./compiler/parser.ts";

repl();


async function repl() {
    const parser = new Parser();
    console.log("\nRepl v0.1")

    while (true) {
        const input = prompt("> ");

        // check is there is not input or exit keyword
        if (!input || input.includes("exit")) {
            Deno.exit(1);
        }

        const program = parser.produceAST(input);
        console.log(program);
    }
}