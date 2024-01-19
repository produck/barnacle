import { SSHSpriteComponent } from './Component.mjs';
import { SSHSpriteExection } from './Execution.mjs';

export class SSHSpriteExecutionManager extends SSHSpriteComponent {
	/** @type {{ [id: string]: SSHSpriteExection }} */
	#registry = {};

	query() {
		return { ...this.#registry };
	}

	get(id) {
		return this.#registry[id] ?? null;
	}

	create() {
		const execution = new SSHSpriteExection(this.client);
		const { id } = execution;

		this.#registry[id] = execution.on('exit', () => delete this.#registry[id]);

		return execution;
	}
}
