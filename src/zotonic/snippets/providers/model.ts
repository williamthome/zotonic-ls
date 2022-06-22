import { ISnippet } from '../../core';
import { SnippetProvider } from '../provider';

export class ModelSnippetProvider extends SnippetProvider {
    constructor() {
        super({
            selector: 'tpl',
            pattern: /\bm\b/,
        });
    }

    public loadSnippets(): Promise<ISnippet[]> {
        return new Promise((resolve) => {
            resolve([
                {
                    prefix: 'm.',
                    description: 'Provide data to templates.',
                    command: {
                        callback: (commands) => commands.showUpSnippets(),
                    },
                },
            ]);
        });
    }
}
