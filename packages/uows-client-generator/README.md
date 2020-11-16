# UOWS Client

## About

This project aims to make it easier to use the User Office Web Service in projects using TypeScript by abstracting the 
details of the SOAP implementation from the user and exposing only the functionality of the web service they can use.

## Setup

This project requires [node.js](https://nodejs.org/en/download/), [this soap library](https://www.npmjs.com/package/soap) and [TypeScript](https://www.typescriptlang.org/download)

Run the following command to enable node.js to work with TypeScript

`npm install @types/node --save`

## How to run

You must be connected to STFC's internal network in order to access the UOWS WSDL.
To use the soap interface offered by this project you must first install the package:

`npm i @stfc-user-programme/uows_client_generator`

Then import it into your script:

`import * as uows_client_generator from "@stfc-user-programme/uows_client_generator";`

Next, run the createInterface method:

`uows_client_generator.createInterface();`

This will produce the UOWSServiceInterface.ts file which you can use to make SOAP calls to the UOWS.

This file describes a class containing the SOAP methods. To use it with the default WSDL (available [here](https://api.facilities.rl.ac.uk/ws/UserOfficeWebService?wsdl)), simply import the file and instantiate the class like so:

`const client = new UOWSSoapClient();`

You can provide a URL or path to a version of the UOWS you wish to use in the constructor:

`const client = new UOWSSoapClient(<WSDL_URL>);`