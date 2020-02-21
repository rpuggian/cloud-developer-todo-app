# ToDo App Serverless Project

The github link to this project is: https://github.com/rpuggian/cloud-developer-todo-app

This project demonstrates the setup of application components as 
a serverless application running on a Cloud Infrastructure

## Requirements
* Node 12
* serverless 1.60.4
* aws cli 1.16.257+


## Testing locally 
The client (React) application is pre-configured to connect to an AWS API Gateway (see src/config.ts)
that should be accessible if I haven't deleted or replaced the service 😄
```
cd client
npm install
npm start
```
The client should automatically start in your browser and load from http://localhost:3000

## Deploying your own Serverless App on AWS
This assumes that you already have an AWS Profile called *serverless* and are using *us-east-2* region
(obviously you can substitute your own settings as required)
```sh
export NODE_OPTIONS=--max_old_space_size=4096

sls deploy -v --aws-profile serverless --aws-region us-east-2
```
:warning: Note that NODE_OPTIONS is required for the _individually_ packaging option in *serverless.yml* to avoid Out Of Memory issues 

## Screenshots
![login](https://github.com/rpuggian/cloud-developer-todo-app/blob/master/screenshots/login.png)

![home](https://github.com/rpuggian/cloud-developer-todo-app/blob/master/screenshots/home.png)

![image](https://github.com/rpuggian/cloud-developer-todo-app/blob/master/screenshots/image_upload.png)

![tasks](https://github.com/rpuggian/cloud-developer-todo-app/blob/master/screenshots/tasks.png)


