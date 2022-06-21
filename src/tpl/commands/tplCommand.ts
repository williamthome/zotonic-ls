// // Defs

// export const commandNames: Readonly<[TplCommandName]> = [
//     "snippetPick"
// ] as const;


// // API

// /**
//  * Not implemented.
//  */
// export class TplCommand {
//     constructor(
//         private getUserChoice: GetUserChoice
//     ) {
//         throw new Error("Not implemented");
//     }

//     snippetPick(snippets: string[]) {
//         return this.getUserChoice(snippets);
//     }
// }

// export type TplCommandName = TplCommandFunctions[keyof TplCommandFunctions];

// export interface ITplCommand {
//     name: TplCommandName,
//     arguments: any[]
// }

// export interface ITplCommand {
//     name: TplCommandName,
//     arguments: any[],
//     hint?: string
// }

// // Internal functions

// type GetUserChoice = (choices: string[]) => Promise<string>;

// type TplCommandInstance = InstanceType<typeof TplCommand>;
// type TplComandKeys = keyof TplCommandInstance;
// type TplCommandFunctions = {
//     [Key in TplComandKeys]: TplCommandInstance[Key] extends Function
//     ? Key
//     : never;
// };

export interface ITplCommand {
    getUserChoice: (
        choices: string[],
        next: (choice: string) => Promise<void>
    ) => Promise<void>,
    insertSnippet: (snippet: string) => Promise<void>
};
