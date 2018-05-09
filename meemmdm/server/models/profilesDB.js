var mongoose = require('mongoose');
var console = require('console');

// var profileInfo = new mongoose.Schema({
//     profilename: {
//         type: String,
//         unique: true,
//         required: true
//     },
//     osversion: Number, //1- Apple, 2-Android, 3- Windows, 4-MacOS, 5-Linux
//     description: String
// });

var profileSchema = new mongoose.Schema({

    adminKeyEmail: {
        type: String,
        unique: true,
        required: true
    },
    profileArray:
        {
            profileInfo: {
                profilename: {
                    type: String,
                    default: " "
                    //unique: true,
                    //required: true
                },
                //osVersion: Number, //1- Apple, 2-Android, 3- Windows, 4-MacOS, 5-Linux
                description: String
            },
            emailProfile: {
                PayloadContent: {
                    EmailAccountDescription: String,
                    EmailAccountName: String,
                    EmailAccountType: String,
                    EmailAddress: String,
                    PreventMove: Boolean,
                    PreventAppSheet: Boolean,
                    disableMailRecentsSyncing: Boolean,
                    allowMailDrop: Boolean,
                    IncomingMailServerAuthentication: String,
                    IncomingMailServerHostName: String,
                    IncomingMailServerPortNumber: Number,
                    IncomingMailServerUseSSL: Boolean,
                    IncomingMailServerUsername: String,
                    IncomingPassword: String,
                    OutgoingPassword: String,
                    OutgoingPasswordSameAsIncomingPassword: Boolean,
                    OutgoingMailServerAuthentication: String,
                    OutgoingMailServerHostName: String,
                    OutgoingMailServerPortNumber: Number,
                    OutgoingMailServerUseSSL: Boolean,
                    OutgoingMailServerUsername: String,
                    SMIMEEnabled: Boolean,
                    SMIMESigningEnabled: Boolean,
                    SMIMESigningCertificateUUID: String,
                    SMIMEEncryptionEnabled: Boolean,
                    SMIMEEncryptionCertificateUUID: String,
                    SMIMEEnablePerMessageSwitch: String
                },
                PayloadDisplayName: String,
                PayloadIdentifier: String,
                PayloadOrganization: String,
                PayloadRemovalDisallowed: Boolean,
                PayloadType: String,
                PayloadUUID: String,
                PayloadVersion: Number
            },

            passcodeProfile: {
                PayloadContent: [
                    {
                        PayloadDescription: String,
                        PayloadDisplayName: String,
                        PayloadIdentifier: String,
                        PayloadType: String,
                        PayloadUUID: String,
                        PayloadVersion: Number,
                        allowSimple: Boolean,
                        forcePIN: Boolean,
                        maxFailedAttempts: Number,
                        maxGracePeriod: Number,
                        maxInactivity: Number,
                        maxPINAgeInDays: Number,
                        minComplexChars: Number,
                        minLength: Number,
                        pinHistory: Number,
                        requireAlphanumeric: Boolean
                    }
                ],
                PayloadDisplayName: String,
                PayloadIdentifier: String,
                PayloadRemovalDisallowed: Boolean,
                PayloadType: String,
                PayloadUUID: String,
                PayloadVersion: Number
            },

            restrictionProfile: {
                PayloadContent: [
                    {
                        PayloadDescription: String,
                        PayloadDisplayName: String,
                        PayloadIdentifier: String,
                        PayloadType: String,
                        PayloadUUID: String,
                        PayloadVersion: Number,
                        allowActivityContinuation: Boolean,
                        allowAddingGameCenterFriends: Boolean,
                        allowAirDrop: Boolean,
                        allowAirPlayIncomingRequests: Boolean,
                        allowAirPrint: Boolean,
                        allowAirPrintCredentialsStorage: Boolean,
                        allowAirPrintiBeaconDiscovery: Boolean,
                        allowAppCellularDataModification: Boolean,
                        allowAppInstallation: Boolean,
                        allowAppRemoval: Boolean,
                        allowAssistant: Boolean,
                        allowAssistantWhileLocked: Boolean,
                        allowAutoCorrection: Boolean,
                        allowAutomaticAppDownloads: Boolean,
                        allowBluetoothModification: Boolean,
                        allowBookstore: Boolean,
                        allowBookstoreErotica: Boolean,
                        allowCamera: Boolean,
                        allowCellularPlanModification: Boolean,
                        allowChat: Boolean,
                        allowCloudBackup: Boolean,
                        allowCloudDocumentSync: Boolean,
                        allowCloudPhotoLibrary: Boolean,
                        allowDefinitionLookup: Boolean,
                        allowDeviceNameModification: Boolean,
                        allowDictation: Boolean,
                        allowEnablingRestrictions: Boolean,
                        allowEnterpriseAppTrust: Boolean,
                        allowEnterpriseBookBackup: Boolean,
                        allowEnterpriseBookMetadataSync: Boolean,
                        allowEraseContentAndSettings: Boolean,
                        allowExplicitContent: Boolean,
                        allowFingerprintForUnlock: Boolean,
                        allowFingerprintModification: Boolean,
                        allowGameCenter: Boolean,
                        allowGlobalBackgroundFetchWhenRoaming: Boolean,
                        allowInAppPurchases: Boolean,
                        allowKeyboardShortcuts: Boolean,
                        allowManagedAppsCloudSync: Boolean,
                        allowMultiplayerGaming: Boolean,
                        allowMusicService: Boolean,
                        allowNews: Boolean,
                        allowNotificationsModification: Boolean,
                        allowOpenFromManagedToUnmanaged: Boolean,
                        allowOpenFromUnmanagedToManaged: Boolean,
                        allowPairedWatch: Boolean,
                        allowPassbookWhileLocked: Boolean,
                        allowPasscodeModification: Boolean,
                        allowPhotoStream: Boolean,
                        allowPredictiveKeyboard: Boolean,
                        allowProximitySetupToNewDevice: Boolean,
                        allowRadioService: Boolean,
                        allowRemoteAppPairing: Boolean,
                        allowRemoteScreenObservation: Boolean,
                        allowSafari: Boolean,
                        allowScreenShot: Boolean,
                        allowSharedStream: Boolean,
                        allowSpellCheck: Boolean,
                        allowSpotlightInternetResults: Boolean,
                        allowSystemAppRemoval: Boolean,
                        allowUIAppInstallation: Boolean,
                        allowUIConfigurationProfileInstallation: Boolean,
                        allowUntrustedTLSPrompt: Boolean,
                        allowVPNCreation: Boolean,
                        allowVideoConferencing: Boolean,
                        allowVoiceDialing: Boolean,
                        allowWallpaperModification: Boolean,
                        allowiTunes: Boolean,
                        forceAirDropUnmanaged: Boolean,
                        forceAirPrintTrustedTLSRequirement: Boolean,
                        forceAssistantProfanityFilter: Boolean,
                        forceAuthenticationBeforeAutoFill: Boolean,
                        forceClassroomAutomaticallyJoinClasses: Boolean,
                        forceClassroomUnpromptedAppAndDeviceLock: Boolean,
                        forceClassroomUnpromptedScreenObservation: Boolean,
                        forceEncryptedBackup: Boolean,
                        forceITunesStorePasswordEntry: Boolean,
                        forceWatchWristDetection: Boolean,
                        forceWiFiWhitelisting: Boolean,
                        ratingApps: Number,
                        ratingMovies: Number,
                        ratingRegion: String,
                        ratingTVShows: Number,
                        safariAcceptCookies: Number,
                        safariAllowAutoFill: Boolean,
                        safariAllowJavaScript: Boolean,
                        safariAllowPopups: Boolean,
                        safariForceFraudWarning: Boolean,
                        whitelistedAppBundleIDs: [
                            String
                        ]
                    }
                ],
                PayloadDisplayName: String,
                PayloadIdentifier: String,
                PayloadRemovalDisallowed: Boolean,
                PayloadType: String,
                PayloadUUID: String,
                PayloadVersion: Number
            }
        }
});

profileSchema.methods.addkeyEmail = function (email) {
    this.adminKeyEmail = email;
}

profileSchema.methods.addProfileName = function (profileInfo) {
    this.profileArray.profileInfo = profileInfo;
}


var Profile = mongoose.model('profile', profileSchema);
module.exports = Profile;