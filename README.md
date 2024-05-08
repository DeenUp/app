# Project Name

A brief description of your project.

## Table of Contents

-   [Installation](#installation)
-   [Usage](#usage)
-   [Features](#features)
-   [Contributing](#contributing)
-   [License](#license)

## Installation

1. Clone the repository.
2. Install dependencies by running `pnpm install`.

## Usage

### iOS

1. Make sure you have XCode and XCommand Line Tools installed [as shown on expo docs](https://docs.expo.dev/workflow/ios-simulator).

    > **NOTE:** If you just installed XCode, or if you have updated it, you need to open the simulator manually once. Run `npx expo start` in the root dir, and then enter `I` to launch Expo Go. After the manual launch, you can run `pnpm dev` in the root directory

2. Run the following in the `root` directory

    ```shell
    pnpm dev:ios
    ```

### Android

1. Install Android Studio tools [as shown on expo docs](https://docs.expo.dev/workflow/android-studio-emulator).

2. Run the following in the `root` directory

    ```shell
    pnpm dev:android
    ```

#### Building the apps

#### iOS

1. Run the following in the `root` directory

    ```shell
    pnpm ios
    ```

## Android

1. Run the following in the `root` directory

    ```shell
    pnpm android
    ```

### Features

-   List the key features of your project here.

## Contributing

Contributions are welcome! Please follow the guidelines in [CONTRIBUTING.md](CONTRIBUTING.md).

## License

This project is licensed under the [MIT License](LICENSE).
