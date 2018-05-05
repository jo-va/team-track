## Setup

```bash
$ yarn
$ react-native upgrade
$ react-native link
```

### IOS

Set the following keys in Info.plist:
```xml
<key>NSLocationAlwaysUsageDescription</key>
<string>TeamTrack needs to access your location for tracking</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>Your location is required by TeamTrack</string>
```
Add location as a background mode in the 'Capabilities' tab in XCode


### Android

Add this to AndroidManifes.xml:
```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<application
    <activity
        android:name=".MainActivity"
        ...
        android:windowSoftInputMode="adjustPan">
    </activity>
</application>
```

Generate a signed key
```bash
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

Put the following in android/gradle.properties:
```
MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_STORE_PASSWORD=*****
MYAPP_RELEASE_KEY_PASSWORD=*****
```

In android/app/build.gradle:
```groovy
...
android {
    ...
    defaultConfig { ... }
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
                storeFile file(MYAPP_RELEASE_STORE_FILE)
                storePassword MYAPP_RELEASE_STORE_PASSWORD
                keyAlias MYAPP_RELEASE_KEY_ALIAS
                keyPassword MYAPP_RELEASE_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            ...
            signingConfig signingConfigs.release
        }
    }
}
...
```

Build/run with these commands:
```bash
$ react-native run-android
$ react-native run-android --variant=release
$ cd android && ./gradlew assembleRelease
```