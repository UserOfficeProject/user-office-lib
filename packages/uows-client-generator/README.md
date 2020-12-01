# UOWS Client

## About

This project aims to make it easier to use the User Office Web Service in projects using TypeScript by abstracting the 
details of the SOAP implementation from the user and exposing only the functionality of the web service they can use.

## Setup

This project requires [node.js](https://nodejs.org/en/download/)

To run this tool from anywhere, install it using the following command:

`npm i -g @stfc-user-programme/uows_client_generator`

## How to Run

To run the tool use the following in the command line:

`uows-client-generator <wsdl_url> <output_path>`

There are default values for both parameters: \
wsdl_url: 'https://api.facilities.rl.ac.uk/ws/UserOfficeWebService?wsdl' \
output_path: './src/UOWSSoapInterface.ts' - this will place it in <path-to-package-installation/src/>

You must be connected to STFC's internal network in order to access the default UOWS WSDL when running the tool. \
If you wish to specify an output path you must specify the wsdl url as well.

Running the tool will produce a TypeScript file which you can use to make SOAP calls to the UOWS.

This file defines a class containing the SOAP methods. To use it with the default WSDL (available [here](https://api.facilities.rl.ac.uk/ws/UserOfficeWebService?wsdl)), simply import the file to your project:

`import UOWSSoapClient from "./UOWSSoapInterface";`

Then instantiate the class like so:

`const client = new UOWSSoapClient();`

You can provide a URL or path to a version of the UOWS you wish to use in the constructor:

`const client = new UOWSSoapClient(<WSDL_URL>);`

## How to Run Tests

To run the tests simply execute the following command in the root of the package directory:

`npm run test`