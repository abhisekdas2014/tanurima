module.exports = {
    routeNotFound: {
        statusCode: 404,
        description: "Route Not Found"
    },
    apiKeyNotFound: {
        statusCode: 401,
        description: "API key not found"
    },
    invalidApiKey: {
        statusCode: 403,
        description: "Invalid API key"
    },
    tokenExpired: {
        statusCode: 401,
        description: "Token expired"
    },
    tokenMalformed: {
        statusCode: 401,
        description: "Token Malformed"
    },
    tokenNotActive: {
        statusCode: 401,
        description: "Token Not Active"
    },
    bearerTokenError: {
        statusCode: 401,
        description: "Bearer Token Error"
    },
    thirdApi_104: {
        statusCode: 429,
        description: "Too many requests"
    },
    joiValidationError: {
        statusCode: 422,
        description: "Validation failed"
    },
    authTokenNotFound: {
        statusCode: 401,
        description: "Auth token not found"
    },
    invalidAuthToken: {
        statusCode: 403,
        description: "Invalid Auth Token"
    },
    invalidOtp: {
        statusCode: 403,
        description: "Invalid OTP"
    },
    bankVerificationFailed: {
        statusCode: 403,
        description: "Invalid Bank Details"
    },
    benificaiaryNameMismatch: {
        statusCode: 403,
        description: "Beneficiary Name Mismatch"
    },
    thirdApi_102: {
        statusCode: 403,
        description: "The request has been rejected by the third-party API with status code 102"
    },
    thirdApiFailure: {
        statusCode: 502,
        description: "Bad Gateway"
    },
    aadharNameMismatched: {
        statusCode: 403,
        description: "Aadhar Card name mismatch"
    },
    panVerificationFailed: {
        statusCode: 403,
        description: "Invalid PAN Details"
    },
    adminNotFound: {
        statusCode: 404,
        description: {
            success: false,
            statusCode: 404,
            message: "Admin not found",
        }
    },
    adminDeActivated: {
        statusCode: 400,
        description: {
            success: false,
            statusCode: 400,
            message: "Admin is de-activated",
        }
    },
    InvalidAdminCredentials: {
        statusCode: 401,
        description: {
            success: false,
            statusCode: 401,
            message: "Please provide correct email or password."
        }
    },
    userNotFound: {
        statusCode: 404,
        description: "User not found"
    },
    otpVerificationFailed: {
        statusCode: 401,
        description: "Request is invalid"
    },
    fileNotFound: {
        statusCode: 404,
        description: "File not Found"
    },
    serverError: {
        statusCode: 500,
        description: {
            message: "Internal Server Error in uploading document",
            status: 500,
            success: false,
        }
    },
    agreementNotExpired: {
        statusCode: 400,
        description: "Agreement is not expired"
    },
    agreementNotFound: {
        statusCode: 404,
        description: "Agreement not found"
    },
    agreementExpired: {
        statusCode: 403,
        description: "Agreement has been expired"
    },
    agreementAlreadyExist: {
        statusCode: 409,
        description: "Agreement already exist"
    },
    aadharAlreadyExists: {
        statusCode: 409,
        description: "Aadhar already exist"
    },
    bankAlreadyVerified: {
        statusCode: 409,
        description: "This account number is already linked with other connector."
    },
    panStausAlreadyUpdated: {
        statusCode: 409,
        description: "PAN Card not in pending state"
    },
    fcmTokenIssue: {
        statusCode: 500,
        description: "Failed to send push notification to the device. Please try again later."
    },
    clientDBApiIssue: {
        statusCode: 500,
        description: "Failed to send data to client side. Please try again later"
    },
    acknowledgementIdNotPresent: {
        statusCode: 404,
        description: "Acknowledgement id is not present"
    },
    leadLSQThirdPartyDuplicacy: {
        statusCode: 200,
        description: {
            success: false,
            message: "Duplicate Lead"
        }
    },
    notificationNotFound: {
        statusCode: 404,
        description: "Notification content not Found"
    },
    notificationEventNotFound: {
        statusCode: 404,
        description: "Notification event not Found"
    },
    adminUserAlreadyExistWithSameMob: {
        statusCode: 409,
        description: {
            success: false,
            statusCode: 409,
            message: "Phone Number is already registered to another account."
        }
    },
    adminUserAlreadyExistWithSameEmail: {
        statusCode: 409,
        description: {
            success: false,
            statusCode: 409,
            message: "Email is already registered to another account."
        }
    },
    adminUserNotActiveStatus: {
        statusCode: 409,
        description: {
            success: false,
            statusCode: 409,
            message: "An account is alreary associated with provided email or phone number. Kindly contact support for further assistance."
        }
    },
    unAuthorizedAcessOrTokenExpired: {
        statusCode: 401,
        description: {
            success: false,
            statusCode: 401,
            message: "Unauthorized access or session token has expired. Please log in again."
        }
    }
};
