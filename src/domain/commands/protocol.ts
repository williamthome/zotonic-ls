import { AnyPromiseable } from '@/common/types';

export type Command = AnyPromiseable;

export type Commands = Record<string, Command>;

export type CommandCallback = (commands: Commands) => ReturnType<Command>;
