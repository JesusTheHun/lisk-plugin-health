import { BasePlugin } from 'lisk-sdk';

export class HealthPlugin extends BasePlugin {
    static get alias() {
        return 'health';
    };

    static get info(){
        return {
            author: 'Jonathan MASSUCHETTI',
            version: '1.0.1',
            name: 'lisk-plugin-health',
        };
    };

    options: {
        enable: boolean;
        delayUntilUnhealthy: number;
    };

    get defaults() {
        return {
            type: 'object',
            properties: {
                enable: {
                    type: 'boolean',
                },
                delayUntilUnhealthy: {
                    type: 'number',
                }
            },
            default: {
                enable: true,
                delayUntilUnhealthy: 11000,
            }
        }
    };

    get events() {
        return [];
    }

    private lastBlockReceivedAt: number;

    get actions() {
        return {
            lastBlock: () => this.lastBlockReceivedAt,
            check: () => {
                const diff = this.lastBlockReceivedAt - Date.now();
                return diff > this.options.delayUntilUnhealthy ? 1 : 0
            }
        }
    };

    async load(channel) {
        // initialize plugin
        if (!this.options.enable) {
            return;
        }

        channel.subscribe('app:block:new', () => {
            this.lastBlockReceivedAt= Date.now();
        });
    };

    async unload() {
        this.lastBlockReceivedAt = undefined;
    };
}
