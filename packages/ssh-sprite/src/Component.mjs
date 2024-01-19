import * as Events from 'node:events';

export class SSHSpriteComponent extends Events.EventEmitter {
	/** @type {import('ssh2').Client} */
	#client;

	get client() {
		return this.#client;
	}

	constructor(client) {
		super();
		this.#client = client;
	}
}
