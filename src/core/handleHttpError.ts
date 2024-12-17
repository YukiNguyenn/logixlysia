import { logToFile, logToTransports } from '../transports'
import { HttpError, Options, RequestInfo, StoreData } from '../types'
import { buildLogMessage } from './buildLogMessage'

export async function handleHttpError(
  request: RequestInfo,
  error: HttpError,
  store: StoreData,
  options?: Options
): Promise<void> {
  const statusCode = error.status || 500
  console.error(
    buildLogMessage('ERROR', request, { status: statusCode }, store, options)
  )

  const promises = []

  if (options?.config?.logFilePath) {
    promises.push(
      logToFile(
        options.config.logFilePath,
        'ERROR',
        request,
        { status: statusCode },
        store,
        options
      )
    )
  }

  if (options?.config?.transports?.length) {
    promises.push(logToTransports('ERROR', request, { status: statusCode }, store, options))
  }

  await Promise.all(promises)
}
