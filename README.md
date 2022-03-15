# S.U.I.T.S. Location Service

## Getting Started

### Required Software      
__Android Targets:__     
Install [Andoid Studio](https://developer.android.com/studio/?gclid=CjwKCAiAvaGRBhBlEiwAiY-yMFpPGMAuF8Pdu0m5BqYEZlK5rA0FqVN8JA9PMEnWqB2tUseRjfJcVRoCzsYQAvD_BwE&gclsrc=aw.ds)  

__iOS Target:__     
Install XCode 

* Note: Follow recomendations on Ionic and Capacitor below.  
* Note: Apple may require that you create a developer account and self-sign your certs in XCode before you are able to build.

General Requirements      
----------------------------------------
[NodeJS LTS](https://nodejs.org/en/)     
[Ionic Framework](https://ionicframework.com/docs/intro/cli)     
[Capacitor](https://capacitorjs.com/docs/getting-started)     
[Homebrew](https://brew.sh/)

Rubygems
1. brew update
2. brew install ruby

Cocoapods
1. brew cleanup -d -v
2. brew install cocoapods


### Preparing     
1. Clone this project on the same drive that you installed Ionic and Capacitor. For most systems this will be your primary disk.
2. Open a terminal window and install the node packages.   
``` bash
# cd to the dir ex:
cd ~/projects/SUITSLS
# ls to verify that package.json exists 
ls -la
# install the packages
npm i 
```
3. Test that your phone can connect to XCode.      
	3a. Connect your phone.     
	3b. Open the project in XCode      
	3c. Look at the build to widget in the top bar of XCode and make sure it reads something like: app > <My Phone Name>     
4. Open a new terminal window (or use VS code)   
5. Run the command:
``` bash
ionic cap run ios
```
6. Select your phone from the devices list, and let the build complete.
* Note: Your phone must be unlocked during this process. 

### On Device     
On iPhone, you will get a message stating that the application is from an unknown source. Click cancel when you see this message (its the only option).     

Go to Settings > General > Device Management
Click under developer app "Apple Development: <your email address>"  
Approve / Verify the app  
Close settings and start the app.   
