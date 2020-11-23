<p align="center">
 <img width=200px src="https://user-images.githubusercontent.com/48583281/99920398-55df7c80-2d77-11eb-8fae-98f8c9161e11.png" alt="Project Logo">
</p>

<h3 align="center">RuffnTumble</h3>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Issues](https://img.shields.io/github/issues/andrewvo89/ruffntumble)](https://github.com/andrewvo89/ruffntumble/issues)
[![GitHub Stars](https://img.shields.io/github/stars/andrewvo89/ruffntumble)](https://github.com/andrewvo89/ruffntumble/stargazers)

</div>

---

<p align="center">
    RuffnTumble is an all-in-one social app for dog owners.
</p>

## 📝 Table of Contents

- [📝 Table of Contents](#-table-of-contents)
- [About](#about)
- [Screenshots](#screenshots)
- [Functions](#functions)
- [🏁 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [🎈 Usage](#-usage)
- [⛏️ Built Using](#️-built-using)
- [✍️ Authors](#️-authors)

## About

RuffnTumble was created to help dog owners connect with eachother as well as dog related services and locations such as parks, beaches, vets, grooming services etc.

## Screenshots
<p align="center">  
 <img src="https://user-images.githubusercontent.com/48583281/99924023-a9a89080-2d8c-11eb-99c3-96b4521ba604.png" width=200 alt="Login">
 <img src="https://user-images.githubusercontent.com/48583281/99924170-394e3f00-2d8d-11eb-82cb-28a8b873f576.png" width=200 alt="Dog Profile">
 <img src="https://user-images.githubusercontent.com/48583281/99924213-6995dd80-2d8d-11eb-87e6-a78ae2e9659f.png" width=200 alt="Staff Calendar">
 <img src="https://user-images.githubusercontent.com/48583281/99924236-83372500-2d8d-11eb-88d2-2ab8185f51a9.png" width=200 alt="Projects">
</p>


## Functions

- Find a Dog Place - Use the phone's GPS to find a dog park, beach, cafe, pub, vetinarian, pet store, pet daycare service or grooming service.
- Track my Walk - Use the GPS to track and record your dog walks (Workin Progress).
- Reminders - Get push notifications for when a recurring events such as vaccinations, dog walks etc. are due (Work in Progress).
- Social - Interact with dog owners in your area (Work in Progress).


## 🏁 Getting Started 

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

1. A Firebase Account (https://firebase.google.com/)
2. Expo Installed (https://expo.io/)
3. ReactJS knowledge including Hooks (https://reactjs.org/)
4. React Native knowledge (https://reactnative.dev/)

### Installation

Create a .env file for in the root folder:

```
FIREBASE_API_KEY=xxxxxxxxxxxxxx
FIREBASE_AUTH_DOMAIN=xxxxxxxxxxxxxx.firebaseapp.com
FIREBASE_DATABASE_URL=https://xxxxxxxxxxxxxx-app.firebaseio.com
FIREBASE_PROJECT_ID=xxxxxxxxxxxxxx
FIREBASE_STORAGE_BUCKET=xxxxxxxxxxxxxxp.appspot.com
FIREBASE_MESSAGING_SENDER_ID=xxxxxxxxxxxxxx
FIREBASE_APP_ID=1:xxxxxxxxxxxxxx
FIREBASE_MEASUREMENT_ID=xxxxxxxxxxxxxx
```

Create a .env file for Firebase Functions in the ./functions/ folder:

```
SMTP_HOST=xxxxxxxxxxxxxx
SMTP_PORT=587
SMTP_USERNAME=xxxxxxxxxxxxxx
SMTP_PASSWORD=xxxxxxxxxxxxxx
ANDROID_CLIENT_ID=xxxxxxxxxxxxxx.apps.googleusercontent.com
IOS_CLIENT_ID=xxxxxxxxxxxxxx.apps.googleusercontent.com
```

## 🎈 Usage

1. Create a Firebase project from your Firebase console.
2. Clone the repository.
3. Install Expo.
   ```default
   npm install --global expo-cli
   ```
4. Make sure the Firebase CLI is installed on your local machine.
   ```default
   npm install -g firebase-tools
   ```
5. Initialize your Firebase project from the root folder
   ```
   firebase init
   ```
6. Install the front end dependencies from the root folder.
   ```default
   expo install
   ```
   Or
   ```default
   yarn install
   ```
7. Navigate to the Firebase Functions folder ./functions/
8. Install the back end dependencies.
   ```default
   npm install
   ```
   Or
   ```default
   yarn install
   ```
9.  Initially deploy Firebase rules, storage and functions.
    ```default
    firebase deploy --only firestore
    ```
    ```default
    firebase deploy --only storage
    ```
    ```default
    firebase deploy --only functions
    ```
10. Run the app from the root folder.
    ```default
    expo start
    ```
    Or
    ```default
    yarn start
    ```

## ⛏️ Built Using

- [React Native](https://reactnative.dev/) - Native App Framework
- [Expo](https://expo.io/) - React Native Framework
- [Firebase](https://firebase.google.com/) - Backend as a Service

## ✍️ Authors

- [@andrewvo89](https://github.com/andrewvo89) - Founder and developer
