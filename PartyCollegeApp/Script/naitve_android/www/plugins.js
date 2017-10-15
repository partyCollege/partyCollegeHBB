cordova.define('cordova/plugin_list', function(require, exports, module) {
	module.exports = [
	    {
            "file": "plugins/cordova-plugin-globalization/www/GlobalizationError.js",
            "id": "cordova-plugin-globalization.GlobalizationError",
            "clobbers": [
                "window.GlobalizationError"
            ]
        },
        {
            "file": "plugins/cordova-plugin-globalization/www/globalization.js",
            "id": "cordova-plugin-globalization.globalization",
            "clobbers": [
                "navigator.globalization"
            ]
        },
        {
            "file": "plugins/cordova-plugin-geolocation/www/android/geolocation.js",
            "id": "cordova-plugin-geolocation.geolocation",
            "clobbers": [
                "navigator.geolocation",
                "xsfGeolocation"
            ]
        },
        {
            "file": "plugins/cordova-plugin-geolocation/www/PositionError.js",
            "id": "cordova-plugin-geolocation.PositionError",
            "runs": true
        },
        {
            "file": "plugins/cordova-plugin-contacts/www/contacts.js",
            "id": "cordova-plugin-contacts.contacts",
            "clobbers": [
                "navigator.contacts",
                "xsfContacts"
            ]
        },
        {
            "file": "plugins/cordova-plugin-contacts/www/Contact.js",
            "id": "cordova-plugin-contacts.Contact",
            "clobbers": [
                "Contact"
            ]
        },
        {
            "file": "plugins/cordova-plugin-contacts/www/convertUtils.js",
            "id": "cordova-plugin-contacts.convertUtils"
        },
        {
            "file": "plugins/cordova-plugin-contacts/www/ContactAddress.js",
            "id": "cordova-plugin-contacts.ContactAddress",
            "clobbers": [
                "ContactAddress"
            ]
        },
        {
            "file": "plugins/cordova-plugin-contacts/www/ContactError.js",
            "id": "cordova-plugin-contacts.ContactError",
            "clobbers": [
                "ContactError"
            ]
        },
        {
            "file": "plugins/cordova-plugin-contacts/www/ContactField.js",
            "id": "cordova-plugin-contacts.ContactField",
            "clobbers": [
                "ContactField"
            ]
        },
        {
            "file": "plugins/cordova-plugin-contacts/www/ContactFindOptions.js",
            "id": "cordova-plugin-contacts.ContactFindOptions",
            "clobbers": [
                "ContactFindOptions"
            ]
        },
        {
            "file": "plugins/cordova-plugin-contacts/www/ContactName.js",
            "id": "cordova-plugin-contacts.ContactName",
            "clobbers": [
                "ContactName"
            ]
        },
        {
            "file": "plugins/cordova-plugin-contacts/www/ContactOrganization.js",
            "id": "cordova-plugin-contacts.ContactOrganization",
            "clobbers": [
                "ContactOrganization"
            ]
        },
        {
            "file": "plugins/cordova-plugin-contacts/www/ContactFieldType.js",
            "id": "cordova-plugin-contacts.ContactFieldType",
            "merges": [
                ""
            ]
        },
        {
            "file": "plugins/cordova-plugin-device-motion/www/Acceleration.js",
            "id": "cordova-plugin-device-motion.Acceleration",
            "clobbers": [
                "Acceleration"
            ]
        },
        {
            "file": "plugins/cordova-plugin-device-motion/www/accelerometer.js",
            "id": "cordova-plugin-device-motion.accelerometer",
            "clobbers": [
                "navigator.accelerometer",
                "xsfAccelerometer"
            ]
        },
        {
            "file": "plugins/cordova-plugin-device-orientation/www/CompassError.js",
            "id": "cordova-plugin-device-orientation.CompassError",
            "clobbers": [
                "CompassError"
            ]
        },
        {
            "file": "plugins/cordova-plugin-device-orientation/www/CompassHeading.js",
            "id": "cordova-plugin-device-orientation.CompassHeading",
            "clobbers": [
                "CompassHeading"
            ]
        },
        {
            "file": "plugins/cordova-plugin-device-orientation/www/compass.js",
            "id": "cordova-plugin-device-orientation.compass",
            "clobbers": [
                "navigator.compass"
            ]
        },
        {
            "file": "plugins/cordova-plugin-file/www/browser/isChrome.js",
            "id": "cordova-plugin-file.isChrome",
            "runs": true
        },
        {
            "file": "plugins/cordova-plugin-media-capture/www/CaptureAudioOptions.js",
            "id": "cordova-plugin-media-capture.CaptureAudioOptions",
            "clobbers": [
                "CaptureAudioOptions"
            ]
        },
        {
            "file": "plugins/cordova-plugin-media-capture/www/CaptureImageOptions.js",
            "id": "cordova-plugin-media-capture.CaptureImageOptions",
            "clobbers": [
                "CaptureImageOptions"
            ]
        },
        {
            "file": "plugins/cordova-plugin-media-capture/www/CaptureVideoOptions.js",
            "id": "cordova-plugin-media-capture.CaptureVideoOptions",
            "clobbers": [
                "CaptureVideoOptions"
            ]
        },
        {
            "file": "plugins/cordova-plugin-media-capture/www/CaptureError.js",
            "id": "cordova-plugin-media-capture.CaptureError",
            "clobbers": [
                "CaptureError"
            ]
        },
        {
            "file": "plugins/cordova-plugin-media-capture/www/MediaFileData.js",
            "id": "cordova-plugin-media-capture.MediaFileData",
            "clobbers": [
                "MediaFileData"
            ]
        },
        {
            "file": "plugins/cordova-plugin-media-capture/www/MediaFile.js",
            "id": "cordova-plugin-media-capture.MediaFile",
            "clobbers": [
                "MediaFile"
            ]
        },
        {
            "file": "plugins/cordova-plugin-media-capture/www/helpers.js",
            "id": "cordova-plugin-media-capture.helpers",
            "runs": true
        },
        {
            "file": "plugins/cordova-plugin-media-capture/www/capture.js",
            "id": "cordova-plugin-media-capture.capture",
            "clobbers": [
                "navigator.device.capture",
                "xsfCapture"
            ]
        },
        {
            "file": "plugins/cordova-plugin-media-capture/www/android/init.js",
            "id": "cordova-plugin-media-capture.init",
            "runs": true
        },
        {
            "file": "plugins/cordova-plugin-network-information/www/network.js",
            "id": "cordova-plugin-network-information.network",
            "clobbers": [
                "navigator.connection",
                "navigator.network.connection",
                "xsfConnection"
            ]
        },
        {
            "file": "plugins/cordova-plugin-network-information/www/Connection.js",
            "id": "cordova-plugin-network-information.Connection",
            "clobbers": [
                "Connection"
            ]
        },
        {
            "file": "plugins/cordova-plugin-vibration/www/vibration.js",
            "id": "cordova-plugin-vibration.notification",
            "merges": [
                "navigator.notification",
                "navigator"
            ]
        },
        {
            "file": "plugins/cordova-plugin-statusbar/www/statusbar.js",
            "id": "cordova-plugin-statusbar.statusbar",
            "clobbers": [
                "window.StatusBar"
            ]
        },
        {
            "file": "plugins/cordova-plugin-media/www/MediaError.js",
            "id": "cordova-plugin-media.MediaError",
            "clobbers": [
                "window.MediaError"
            ]
        },
        {
            "file": "plugins/cordova-plugin-media/www/Media.js",
            "id": "cordova-plugin-media.Media",
            "clobbers": [
                "window.Media",
                "xsfMedia"
            ]
        },



	                  {
	                      "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
	                      "id": "cordova-plugin-splashscreen.SplashScreen",
	                      "clobbers": [
	                          "navigator.splashscreen",
	                          "xsfSplashscreen"
	                      ]
	                  },
	                  {
	                      "file": "plugins/cordova-plugin-file/www/DirectoryEntry.js",
	                      "id": "cordova-plugin-file.DirectoryEntry",
	                      "clobbers": [
	                          "window.DirectoryEntry"
	                      ]
	                  },
	                  {
	                      "file": "plugins/cordova-plugin-file/www/DirectoryReader.js",
	                      "id": "cordova-plugin-file.DirectoryReader",
	                      "clobbers": [
	                          "window.DirectoryReader"
	                      ]
	                  },
	                  {
	                      "file": "plugins/cordova-plugin-file/www/Entry.js",
	                      "id": "cordova-plugin-file.Entry",
	                      "clobbers": [
	                          "window.Entry"
	                      ]
	                  },
	                  {
	                      "file": "plugins/cordova-plugin-file/www/File.js",
	                      "id": "cordova-plugin-file.File",
	                      "clobbers": [
	                          "window.File"
	                      ]
	                  },
	                  {
	                      "file": "plugins/cordova-plugin-file/www/FileEntry.js",
	                      "id": "cordova-plugin-file.FileEntry",
	                      "clobbers": [
	                          "window.FileEntry"
	                      ]
	                  },
	                  {
	                      "file": "plugins/cordova-plugin-file/www/FileError.js",
	                      "id": "cordova-plugin-file.FileError",
	                      "clobbers": [
	                          "window.FileError"
	                      ]
	                  },
	                  {
	                      "file": "plugins/cordova-plugin-file/www/FileReader.js",
	                      "id": "cordova-plugin-file.FileReader",
	                      "clobbers": [
	                          "window.FileReader",
	                          "xsfFileReader"
	                      ]
	                  },
	                  {
	                      "file": "plugins/cordova-plugin-file/www/FileSystem.js",
	                      "id": "cordova-plugin-file.FileSystem",
	                      "clobbers": [
	                          "window.FileSystem"
	                      ]
	                  },
	                  {
	                      "file": "plugins/cordova-plugin-file/www/FileUploadOptions.js",
	                      "id": "cordova-plugin-file.FileUploadOptions",
	                      "clobbers": [
	                          "window.FileUploadOptions"
	                      ]
	                  },
	                  {
	                      "file": "plugins/cordova-plugin-file/www/FileUploadResult.js",
	                      "id": "cordova-plugin-file.FileUploadResult",
	                      "clobbers": [
	                          "window.FileUploadResult"
	                      ]
	                  },
	                  {
	                      "file": "plugins/cordova-plugin-file/www/FileWriter.js",
	                      "id": "cordova-plugin-file.FileWriter",
	                      "clobbers": [
	                          "window.FileWriter",
	                          "xsfFileWriter"
	                      ]
	                  },
	                  {
	                      "file": "plugins/cordova-plugin-file/www/Flags.js",
	                      "id": "cordova-plugin-file.Flags",
	                      "clobbers": [
	                          "window.Flags"
	                      ]
	                  },
	                  {
	                      "file": "plugins/cordova-plugin-file/www/LocalFileSystem.js",
	                      "id": "cordova-plugin-file.LocalFileSystem",
	                      "clobbers": [
	                          "window.LocalFileSystem"
	                      ],
	                      "merges": [
	                          "window"
	                      ]
	                  },
	                  {
	                      "file": "plugins/cordova-plugin-file/www/Metadata.js",
	                      "id": "cordova-plugin-file.Metadata",
	                      "clobbers": [
	                          "window.Metadata"
	                      ]
	                  },
	                  {
	                      "file": "plugins/cordova-plugin-file/www/ProgressEvent.js",
	                      "id": "cordova-plugin-file.ProgressEvent",
	                      "clobbers": [
	                          "window.ProgressEvent"
	                      ]
	                  },
	                  {
	                      "file": "plugins/cordova-plugin-file/www/fileSystems.js",
	                      "id": "cordova-plugin-file.fileSystems"
	                  },
	                  {
	                      "file": "plugins/cordova-plugin-file/www/requestFileSystem.js",
	                      "id": "cordova-plugin-file.requestFileSystem",
	                      "clobbers": [
	                          "window.requestFileSystem"
	                      ]
	                  },
	                  {
	                      "file": "plugins/cordova-plugin-file/www/resolveLocalFileSystemURI.js",
	                      "id": "cordova-plugin-file.resolveLocalFileSystemURI",
	                      "merges": [
	                          "window"
	                      ]
	                  },
	                  {
	                      "file": "plugins/cordova-plugin-file/www/browser/isChrome.js",
	                      "id": "cordova-plugin-file.isChrome",
	                      "runs": true
	                  },
	                  {
	                      "file": "plugins/cordova-plugin-file/www/android/FileSystem.js",
	                      "id": "cordova-plugin-file.androidFileSystem",
	                      "merges": [
	                          "FileSystem"
	                      ]
	                  },
	                  {
	                      "file": "plugins/cordova-plugin-file/www/fileSystems-roots.js",
	                      "id": "cordova-plugin-file.fileSystems-roots",
	                      "runs": true
	                  },
	                  {
	                      "file": "plugins/cordova-plugin-file/www/fileSystemPaths.js",
	                      "id": "cordova-plugin-file.fileSystemPaths",
	                      "merges": [
	                          "cordova"
	                      ],
	                      "runs": true
	                  },
	                  {
	                      "file": "plugins/cordova-plugin-file-transfer/www/FileTransferError.js",
	                      "id": "cordova-plugin-file-transfer.FileTransferError",
	                      "clobbers": [
	                          "window.FileTransferError"
	                      ]
	                  },
	                  {
	                      "file": "plugins/cordova-plugin-file-transfer/www/FileTransfer.js",
	                      "id": "cordova-plugin-file-transfer.FileTransfer",
	                      "clobbers": [
	                          "window.FileTransfer",
                               "xsf.FileTransfer"
	                      ]
	                  },
	                  {
	                      "file": "plugins/cordova-plugin-device/www/device.js",
	                      "id": "cordova-plugin-device.device",
	                      "clobbers": [
	                          "device"
	                      ]
	                  },
	                  {
	                      "file": "plugins/cordova-plugin-dialogs/www/notification.js",
	                      "id": "cordova-plugin-dialogs.notification",
	                      "merges": [
	                          "navigator.notification"
	                      ]
	                  },
	                  {
	                      "file": "plugins/cordova-plugin-dialogs/www/android/notification.js",
	                      "id": "cordova-plugin-dialogs.notification_android",
	                      "merges": [
	                          "navigator.notification"
	                      ]
	                  },
	                  {
	                      "file": "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
	                      "id": "cordova-plugin-inappbrowser.inappbrowser",
	                      "clobbers": [
	                          "cordova.InAppBrowser.open",
	                          "window.open"
	                      ]
	                  },
	                  {
	                      "file": "plugins/cordova-plugin-appversion/www/app-version.js",
	                      "id": "cordova-plugin-appversion.RareloopAppVersion",
	                      "clobbers": [
	                          "AppVersion"
	                      ]
	                  },
	                  {
	                      "file": "plugins/cordova-plugin-camera/www/CameraConstants.js",
	                      "id": "cordova-plugin-camera.Camera",
	                      "clobbers": [
	                          "Camera"
	                      ]
	                  },
	                  {
	                      "file": "plugins/cordova-plugin-camera/www/CameraPopoverOptions.js",
	                      "id": "cordova-plugin-camera.CameraPopoverOptions",
	                      "clobbers": [
	                          "CameraPopoverOptions"
	                      ]
	                  },
	                  {
	                      "file": "plugins/cordova-plugin-camera/www/Camera.js",
	                      "id": "cordova-plugin-camera.camera",
	                      "clobbers": [
	                          "navigator.camera",
	                          "xsfCamera"
	                      ]
	                  },
	                  {
	                      "file": "plugins/cordova-plugin-camera/www/CameraPopoverHandle.js",
	                      "id": "cordova-plugin-camera.CameraPopoverHandle",
	                      "clobbers": [
	                          "CameraPopoverHandle"
	                      ]
	                  },
	                  {
	                      "file": "plugins/cordova-plugin-x-toast/www/Toast.js",
	                      "id": "cordova-plugin-x-toast.Toast",
	                      "clobbers": [
	                          "window.plugins.toast",
	                          "xsfToast"
	                      ]
	                  },
	                  {
	                      "file": "plugins/cordova-plugin-x-toast/test/tests.js",
	                      "id": "cordova-plugin-x-toast.tests"
	                  },
	                  {
	                      "file": "plugins/cordova-plugin-actionsheet/www/ActionSheet.js",
	                      "id": "cordova-plugin-actionsheet.ActionSheet",
	                      "clobbers": [
	                          "window.plugins.actionsheet"
	                      ]
	                  },
	                  {
	                      "file": "plugins/cordova-plugin-background-mode/www/background-mode.js",
	                      "id": "cordova-plugin-background-mode.BackgroundMode",
	                      "clobbers": [
	                          "cordova.plugins.backgroundMode",
	                          "plugin.backgroundMode"
	                      ]
	                  },
	                  {
	                      "file": "plugins/phonegap-plugin-barcodescanner/www/barcodescanner.js",
	                      "id": "phonegap-plugin-barcodescanner.BarcodeScanner",
	                      "clobbers": [
	                          "cordova.plugins.barcodeScanner",
                              "xsfBarcode"
	                      ]
	                  },
	                  {
	                      "file": "plugins/org.binarypark.cordova.plugins.version/www/getAppVersion.js",
	                      "id": "org.binarypark.cordova.plugins.version.getAppVersion",
	                      "clobbers": [
	                          "cordova.plugins.version"
	                      ]
	                  },
	                  {
	                      "file": "plugins/de.appplant.cordova.plugin.local-notification/www/local-notification.js",
	                      "id": "de.appplant.cordova.plugin.local-notification.LocalNotification",
	                      "clobbers": [
	                          "cordova.plugins.notification.local",
	                          "plugin.notification.local"
	                      ]
	                  },
	                  {
	                      "file": "plugins/de.appplant.cordova.plugin.local-notification/www/local-notification-core.js",
	                      "id": "de.appplant.cordova.plugin.local-notification.LocalNotification.Core",
	                      "clobbers": [
	                          "cordova.plugins.notification.local.core",
	                          "plugin.notification.local.core"
	                      ]
	                  },
	                  {
	                      "file": "plugins/de.appplant.cordova.plugin.local-notification/www/local-notification-util.js",
	                      "id": "de.appplant.cordova.plugin.local-notification.LocalNotification.Util",
	                      "merges": [
	                          "cordova.plugins.notification.local.core",
	                          "plugin.notification.local.core"
	                      ]
	                  },
	                  {
	                      "file": "plugins/cordova-plugin-app-version/www/AppVersionPlugin.js",
	                      "id": "cordova-plugin-app-version.AppVersionPlugin",
	                      "clobbers": [
	                          "cordova.getAppVersion"
	                      ]
	                  },
	                  {
	                      "file": "plugins/cordova-plugin-appavailability/www/AppAvailability.js",
	                      "id": "cordova-plugin-appavailability.AppAvailability",
	                      "clobbers": [
	                          "appAvailability"
	                      ]
	                  },
	                  {
	                      "file": "plugins/cordova-open/www/disusered.open.js",
	                      "id": "cordova-open.Open",
	                      "merges": [
	                          "cordova.plugins.disusered"
	                      ]
	                  },
	                  {
	                      "file": "plugins/xsf/www/xsf.js",
	                      "id": "xsf",
	                      "clobbers": ["xsf","box"]
	              	},
	              	{
	                      "file": "plugins/xsf.window/www/window.js",
	                      "id": "xsf.window",
	                      "merges": ["xsfWindow"]
	                  },
	              	{
	                      "file": "plugins/xsf.wps/www/wps.js",
	                      "id": "xsf.wps",
	                      "clobbers": ["xsfWPS"]
	                  },
	                  {
                          "file": "plugins/org.pgsqlite/www/SQLitePlugin.js",
                          "id": "org.pgsqlite.SQLitePlugin",
                          "merges": ["xsfSqlite"]
                       },
	                  {
	                      "file": "plugins/xsf.http/www/http.js",
	                      "id": "xsf.http",
	                      "merges": ["xsfHttp"]
	                  },
	                  {
                            "file": "plugins/com.phonegap.plugins.fileopener/www/fileopener.js",
                             "id": "com.phonegap.plugins.fileopener.FileOpener",
                              "clobbers": [
                                  "window.plugins.fileOpener",
                                    "xsfFileOpener"
                                    ]
                       },
	                  {
	                      "file": "plugins/xsf.mobile/www/mobile.js",
	                      "id": "xsf.mobile",
	                      "merges": ["xsfMobile"]
	                  },
//	                  {
//	                      "file": "plugins/xsf.media/www/media.js",
//	                      "id": "xsf.media",
//	                      "merges": ["xsfMedia"]
//	                  },
	                  {
	                      "file": "plugins/xsf.record/www/record.js",
	                      "id": "xsf.record",
	                      "merges": ["xsfRecord"]
	                  },
	                  {
	                      "file": "plugins/xsf.recognition/www/recognition.js",
	                      "id": "xsf.recognition",
	                      "merges": ["xsfRecognition"]
	                  },
	                  {
	                      "file": "plugins/xsf.zip/www/zip.js",
	                      "id": "xsf.zip",
	                      "merges": ["xsfZip"]
	                  },
	                  {
	                      "file": "plugins/xsf.nfc/www/nfc.js",
	                      "id": "xsf.nfc",
	                      "merges": ["xsfNFC"]
	                  },
	                  {
	                      "file": "plugins/xsf.signature/www/signature.js",
	                      "id": "xsf.signature",
	                      "merges": ["xsfSignature"]
	                  },
	                  {
	                      "file": "plugins/xsf.store/www/store.js",
	                      "id": "xsf.store",
	                      "merges": ["xsfStore"]
	                  },
	                  {
	                      "file": "plugins/xsf.store/www/storeEx.js",
	                      "id": "xsf.storeEx",
	                      "merges": ["xsfStoreEx"]
	                  },
	                  {
	                      "file": "plugins/xsf.bdmap/www/bdmap.js",
	                      "id": "xsf.bdmap",
	                      "merges": ["xsfBDMap"]
	                  },
	                  {
	                      "file": "plugins/xsf.datetimepicker/www/datetimepicker.js",
	                      "id": "xsf.datetimepicker",
	                      "clobbers": ["xsfDateTimePicker"]
	                   },
	                   {   
	                      "file": "plugins/xsf.orguserpicker/www/orguserpicker.js",
	                      "id": "xsf.orguserpicker",
	                      "merges": ["xsfOrgUserPicker"]
	                  },
	                  {
	                  	"file": "plugins/xsf.datasync/www/datasync.js",
	                  	"id": "xsf.datasync",
	                  	"merges": ["xsfDataSync"]
	                  },
	                  {
	                  	"file": "plugins/xsf.pushmessage/www/pushmessage.js",
	                  	"id": "xsf.pushmessage",
	                  	"merges": ["xsfPushMessage"]
	                  }
	              ];
	              module.exports.metadata = 
	              // TOP OF METADATA
	              {
	                  "cordova-plugin-crosswalk-webview": "1.7.0",
	                  "cordova-plugin-splashscreen": "3.2.2",
	                  "cordova-plugin-compat": "1.0.0",
	                  "cordova-plugin-file": "4.3.0",
	                  "cordova-plugin-file-transfer": "1.5.1",
	                  "cordova-plugin-device": "1.1.2",
	                  "cordova-plugin-dialogs": "1.2.1",
	                  "cordova-plugin-inappbrowser": "1.4.0",
	                  "cordova-plugin-appversion": "1.0.0",
	                  "cordova-plugin-camera": "2.2.0",
	                  "cordova-plugin-x-toast": "2.5.1",
	                  "cordova-plugin-actionsheet": "2.2.2",
	                  "cordova-plugin-background-mode": "0.6.5",
	                  "phonegap-plugin-barcodescanner": "5.0.0",
	                  "org.binarypark.cordova.plugins.version": "0.2.3",
	                  "cordova-plugin-app-event": "1.2.0",
	                  "de.appplant.cordova.plugin.local-notification": "0.8.4",
	                  "cordova-plugin-app-version": "0.1.8",
	                  "cordova-plugin-appavailability": "0.4.2",
	                  "cordova-open": "1.0.9",

	                  "cordova-plugin-whitelist": "1.3.0",
                      "cordova-plugin-globalization": "1.0.4",
                      "cordova-plugin-geolocation": "2.4.0",
                      "cordova-plugin-contacts": "2.2.0",
                      "cordova-plugin-console": "1.0.4",
                      "cordova-plugin-device-motion": "1.2.2",
                      "cordova-plugin-device-orientation": "1.0.4",
                      "cordova-plugin-media-capture": "1.4.0",
                      "cordova-plugin-network-information": "1.3.0",
                      "cordova-plugin-vibration": "2.1.2",
                      "cordova-plugin-statusbar": "2.2.0",
                      "cordova-plugin-media": "2.4.0"
	              };
// BOTTOM OF METADATA
});