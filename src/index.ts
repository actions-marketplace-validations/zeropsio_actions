import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as cache from '@actions/cache'

const HELP_MESSAGE =
  '💡 Need help? Join our Discord community at https://discord.gg/zeropsio'

async function run() {
  try {
    const serviceId = core.getInput('service-id', { required: true })
    const accessToken = core.getInput('access-token', { required: true })

    if (!accessToken || accessToken.trim() === '') {
      throw new Error(
        `Zerops access token is empty or not provided. Make sure you have set the access-token input in your workflow file or repository secrets.\n${HELP_MESSAGE}`
      )
    }

    const zcliPath = '/usr/local/bin/zcli'
    const zcliCacheKey = 'zcli-linux-amd64-cache'

    const cacheKey = await cache.restoreCache([zcliPath], zcliCacheKey)
    if (cacheKey) {
      core.info('💡 Zerops CLI cache hit')
    } else {
      core.info('😲 Zerops CLI cache miss')

      core.info('⚡ Installing Zerops CLI...')
      try {
        await exec.exec('curl', [
          '-L',
          'https://github.com/zeropsio/zcli/releases/latest/download/zcli-linux-amd64',
          '-o',
          zcliPath
        ])
        await exec.exec('chmod', ['+x', zcliPath])
      } catch (installError) {
        throw new Error(
          `😵‍💫 Failed to download or install Zerops CLI: ${installError instanceof Error ? installError.message : 'Unknown error'}\n${HELP_MESSAGE}`
        )
      }

      await cache.saveCache([zcliPath], zcliCacheKey)
    }

    core.exportVariable('ZEROPS_TOKEN', accessToken)

    core.info('⚡ Logging in with Zerops token...')
    try {
      await exec.exec(`zcli login ${accessToken}`)
    } catch (loginError) {
      throw new Error(
        `😵‍💫 Failed to authenticate with Zerops. 🧐 Please check if your access token is valid and properly configured in your repository secrets.\n${HELP_MESSAGE}`
      )
    }

    const deployCommand = `zcli push --serviceId ${serviceId}`
    core.info(`⚡ Executing: ${deployCommand}`)
    await exec.exec(deployCommand)

    core.info('✅ Deployment completed successfully.')
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('access token')) {
        core.setFailed(`⚠️ Authentication Error: ${error.message}`)
      } else {
        core.setFailed(`⚠️ Action failed with error: ${error.message}`)
      }
    } else {
      core.setFailed(`⚠️ Action failed with an unknown error.\n${HELP_MESSAGE}`)
    }
  }
}

run()
