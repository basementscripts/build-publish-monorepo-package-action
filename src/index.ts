import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'
import * as core from '@actions/core'

export interface GetPublishedVersionRequest {
	packageName: string
	token: string
	org: string
}

const getLatestPublishedVersion = async ({
	packageName,
	token,
	org
}: GetPublishedVersionRequest): Promise<string> => {
	const versions = await fetch(
		`https://api.github.com/orgs/${org}/packages/npm/${packageName}/versions`,
		{
			headers: {
				Accept: 'application/vnd.github+json',
				Authorization: `Bearer ${token}`,
				'X-GitHub-Api-Version': '2022-11-28'
			}
		}
	)
	const data = await versions.json()

	return data[0].name
}

const getPackageMeta = (name: string) => {
	const parts = name.split('/')
	return parts.length === 1
		? { org: '', name: parts[0] }
		: { org: parts[0], name: parts[parts.length - 1] }
}

const getInput = () => ({
	token: core.getInput('github-token'),
	packagePath: core.getInput('package-path')
})

export async function run(): Promise<void> {
	try {
		const { token, packagePath } = getInput()

		// Get the current working directory
		const cwd = process.cwd()
		// Get the context package path
		const contextPath = path.join(cwd, packagePath)
		// Get the context package package.json
		const packageJson = JSON.parse(fs.readFileSync(path.join(contextPath, 'package.json'), 'utf8'))
		const meta = getPackageMeta(packageJson.name)

		const published = await getLatestPublishedVersion({
			packageName: meta.name,
			token,
			org: meta.org
		})

		console.log(
			'build-publish-monorepo-package-action',
			packageJson.name,
			cwd,
			packageJson.version,
			published
		)
		core.setOutput('published', true)
		core.setOutput('version', packageJson.version)
	} catch (e) {
		e instanceof Error && core.setFailed(e.message)
	}
}

run()
