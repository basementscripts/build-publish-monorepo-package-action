import * as core from '@actions/core'

export async function run(): Promise<void> {
	try {
		console.log('Hello from build-publish-monorepo-package-action')
	} catch (e) {
		e instanceof Error && core.setFailed(e.message)
	}
}

run()
