import { BasePlugin, utils } from 'lisk-sdk';

export interface HealthPluginOptions {
    enable: boolean;
    delayUntilUnhealthy: number;
}

export class HealthPlugin extends BasePlugin {
    static get alias() {
        return 'health';
    };

    static get info(){
        return {
            author: 'Jonathan MASSUCHETTI',
            version: '1.0.2',
            name: 'lisk-plugin-health',
        };
    };

    options: HealthPluginOptions;

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
            lastBlockTime: () => this.lastBlockReceivedAt,
            check: (params?: Record<keyof Omit<HealthPluginOptions, 'enable'>, unknown>) => {
                const localOptions = utils.objects.mergeDeep(this.options, params)

                const diff = this.lastBlockReceivedAt - Date.now();
                return diff > localOptions.delayUntilUnhealthy ? 1 : 0
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
