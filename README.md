# Installation
```
yarn
mv node_modules/react-native-notifications/ReactNativeNotifications.podspec node_modules/react-native-notifications/react-native-notifications.podspec
```

## Development
```
react-native run-ios
```

## Android build issue
Edit ~/Projects/blockmonitor/block-monitor-mobile/node_modules/react-native-notifications/lib/android/app/src/main/AndroidManifest.xml
    and add `android:exported="false"` to the <activity> that has an <intent-filter>

Todo: update readct-native-notifications to pull in the fix for this issue