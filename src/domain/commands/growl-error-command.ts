export type GrowlErrorCommand = (args: {
    error: string | Error;
}) => Promise<void>;
