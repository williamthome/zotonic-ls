export type OnChoiceSelectedCommand = (
    choice: string | undefined,
) => Promise<void>;

export type GetUserChoiceCommand = (args: {
    choices: string[];
    onChoiceSelected: OnChoiceSelectedCommand;
}) => Promise<void>;
