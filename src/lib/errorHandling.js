export const NO_INTERNET_MESSAGE =
  'Cannot run the analysis: no internet connection. Please try again later.'
export const REQUEST_TIMEOUT_MESSAGE = 'Request timeout'
export const GENERIC_ERROR_MESSAGE = 'Unable to run the analysis. Please try again later.'

export function resolveErrorMessage(err) {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return NO_INTERNET_MESSAGE
  }
  if (err instanceof TypeError) {
    return NO_INTERNET_MESSAGE
  }
  if (err instanceof Error && err.message === REQUEST_TIMEOUT_MESSAGE) {
    return REQUEST_TIMEOUT_MESSAGE
  }
  if (err instanceof Error) {
    return err.message || GENERIC_ERROR_MESSAGE
  }
  return null
}
