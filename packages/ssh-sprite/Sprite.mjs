import * as crypto from 'node:crypto';
import * as SSH from 'ssh2';

export class SSHSprite {
	/** @type {SSH.Client | null} */
	#connection = null;

	#channel = {
		exec: {},
		shell: {},
		sftp: null,
	};

	#negotiated = null;

	#forward = [];

	constructor() {
		Object.freeze(this);
	}

	createCommand() {

	}

	createShell() {

	}

	consume() {

	}

	async disconnect() {

	}

	async connent(credential) {
		const connection = new SSH.Client();

		return await new Promise((reslove, reject) => {
			connection.once('ready', () => this.#connection = connection).connect({

			});
		});
	}
}
