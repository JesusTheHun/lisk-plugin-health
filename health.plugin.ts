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
            version: '1.0.4',
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

    private lastBlockReceivedAt: number = 0;

    get actions() {
        const options = utils.objects.mergeDeep({}, this.defaults.default, this.options) as HealthPluginOptions;

        return {
            lastBlockTime: () => this.lastBlockReceivedAt,
            isHealthy: (params?: Record<keyof Omit<HealthPluginOptions, 'enable'>, unknown>) => {
                const localOptions = utils.objects.mergeDeep({}, options, params)

                const diff = Date.now() - this.lastBlockReceivedAt;
                return diff < localOptions.delayUntilUnhealthy
            }
        }
    };

    async load(channel) {
        // initialize plugin
        if (!this.options.enable) {
            return;
        }

        channel.subscribe('app:block:new', () => {
            this.lastBlockReceivedAt = Date.now();
        });
    };

    async unload() {
        this.lastBlockReceivedAt = undefined;
    };
}
