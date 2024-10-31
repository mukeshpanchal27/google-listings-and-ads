/**
 * Checks the status of account connection and creation for Google Merchant Center.
 *
 * This function evaluates the responses from attempts to connect to and create a
 * Google Merchant Center account. It returns `true` if any of the following conditions are met:
 * - The `resultConnectMC` response status is 403 or 409, indicating authorization or conflict errors.
 * - The `resultCreateMCAccount` response status is 403 or 503, indicating authorization or service errors.
 * - The `resultCreateMCAccount` process is currently loading.
 *
 * @param {Object} resultConnectMC - The result object for connecting to the Google Merchant Center account.
 * @param {Object} resultConnectMC.response - The HTTP response for the connection attempt.
 * @param {number} resultConnectMC.response.status - The HTTP status code for the connection attempt.
 * @param {Object} resultCreateMCAccount - The result object for creating the Google Merchant Center account.
 * @param {Object} resultCreateMCAccount.response - The HTTP response for the account creation attempt.
 * @param {number} resultCreateMCAccount.response.status - The HTTP status code for the account creation attempt.
 * @param {boolean} resultCreateMCAccount.loading - Whether the account creation process is currently loading.
 */
export const hasAccountConnectionIssue = (
	resultConnectMC,
	resultCreateMCAccount
) => {
	return (
		[ 403, 409 ].includes( resultConnectMC.response?.status ) ||
		[ 403, 503 ].includes( resultCreateMCAccount.response?.status ) ||
		resultCreateMCAccount.loading
	);
};
