import { SSHSpriteComponent } from './Component.mjs';

const BASE_EXEC_OPTIONS = {
	allowHalfOpen: false,
	x11: false,
};

export class SSHSpriteExection extends SSHSpriteComponent {
	#id = crypto.randomUUID();

	get id() {
		return this.#id;
	}

	#script = null;

	get script() {
		return this.#script;
	}

	setScript(content) {
		this.#script = content;

		return this;
	}

	#environment = {};

	get environment () {
		return { ...this.#environment };
	}

	setEnvironment(object) {
		this.#environment = { ...object };

		return this;
	}

	#pty = false;

	get pty() {
		return this.#pty;
	}

	usePTY(flag = true) {
		this.#pty = flag;

		return this;
	}

	/** @type {import('ssh2').Channel | null} */
	#channel = null;

	get stdin() {
		return this.#channel;
	}

	get stdout() {
		return this.#channel;
	}

	get stderr() {
		return this.#channel?.stderr ?? null;
	}

	get closed() {
		return this.#channel?.closed ?? null;
	}

	#result = {};

	get result() {
		return { ...this.#result };
	}

	#running = false;

	async start() {
		if (this.#running) {
			throw new Error('Running.');
		}

		this.#running = true;

		return await new Promise((resolve, reject) => {
			this.client.exec(this.script, {
				...BASE_EXEC_OPTIONS,
				pty: this.#pty,
				env: this.#environment,
			}, (cause, channel) => {
				if (cause) {
					return reject(new Error('Start failed.', { cause }));
				}

				this.#channel = channel.on('close', (code, signal) => {
					this.#result.code = code;
					this.#result.signal = signal;
					this.emit('exit');
				});

				resolve();
			});
		});
	}

	async close() {
		if (!this.#running) {
			throw new Error('Not running.');
		}

		if (this.#channel === null) {
			throw new Error('Not ready.');
		}

		if (this.#channel.closed) {
			throw new Error('Closed.');
		}

		return await new Promise((resolve, reject) => {
			this.#channel
				.once('error', cause => reject(new Error('Closing failed', { cause })))
				.once('close', (code, signal) => resolve({ code, signal }))
				.close();
		});
	}
}
