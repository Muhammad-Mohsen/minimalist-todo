# minimalist-todo
A minimalist TODO app...It's in the name, really.

## Motivation
I wanted to do this to develop/test some 'native' web components techniques and see how far (near) I can push things to get a 'framework DX' without a framework

## "Techniques"
- using template strings to generate HTML
- binding events (including custom events) in HTML
- using 'Named access on the Window object'
- using light DOM in Web Components
- extending the DOM API
- using CSS for declarative state management

I understand that most of these techniques are frowned upon, but in today's world of front-end frameworks, they aren't really that bad if you think about it.

## Environment

### Development
The app needs to be 'served' from a non-null domain because it's using js modules.
- On Windows, simply create a Virutal Directory under the default website and have it point to the `src` directory.

### Building
The app uses the [`Capacitor`](https://capacitorjs.com/) framework to generate the mobile app.

#### First-Time Initialization
The below commands are only here for completeness, I already ran them and the result is committed.
```
npm install @capacitor/cli @capacitor/core
npx cap init
```

```
npm install @capacitor/ios @capacitor/android
npx cap add android
```

#### Cloning
- run `npm install`
- run `npm run build`
- run `npx capacitor sync android`
- open Android Studio and build the app!

#### Generating App Icon & Splash Screen
- The `www/manifest.json` file is needed for the assets package to work!
- run the below command
```
npx @capacitor/assets generate --iconBackgroundColor #fff0d9 --iconBackgroundColorDark #fff0d9 --splashBackgroundColor #fff0d9 --splashBackgroundColorDark #fff0d9
```

More info [here](https://github.com/ionic-team/capacitor-assets)