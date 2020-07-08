# :tv: MatesPlayer
Ultra modern desktop video player. Created as a hobby project to have a video player which can be completely customizable and yet powerful with no compromises.<br />
Feel free to make a pull request or drop a message at :email: **suryasantosh14523@gmail.com** if you want to develop this player or work with me .
## :computer: Technologies Used
* Electron JS
* Electron Forge
* Node JS

## :fire: How to use
* Clone the project
* Install the dependencies
```
npm install
```

* Creating the executable for your device
```
npm run make
```

* You can find the executable in **out/make** folder inside the directory
* Now run the executable and now you have a fully customizable, powerful **MatesPlayer**

## :warning: Known Issues

* ### Permission Denied in linux
  * **Reason**
    * As a user you might not have right permissions to write and read the config file stored at **/usr/lib/matesplayer/resources/app/src/assets/config.json**
  * **Solution**
    * Open your terminal and run this command
    ```
    cd /usr/lib/matesplayer/resources/app/src/assets/ && sudo chmod o=rw config.json
    ```
