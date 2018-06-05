├── app -- [This is the main business logic folder. All the requests from external devices are processed in this folder]
│   ├── app.js -- [Parses the requests and sends it to 'browser' or 'device' module. Before sending to either of the
                    modules, the requests will go through the security layer to check the auth ID. The authID will 
                    be present only in the requests sent from Browser. However, there is another special HashID which 
                    needs to be sent from the device and that also will be checked in the security layer.]
│   ├── browser -- [This folder will contain the business logic to handle all the communication which
                    happen between browser and server only. This will not process requests which will 
                    go to the mobile device]
│   │   ├── controller -- [The controller folder will have different classes to handle the Authentication,
                            profile and enroll modules]
│   │   │   ├── auth -- [Authentication class as per section 2.2 REST API spec]
│   │   │   │   └── auth.js
│   │   │   ├── enroll -- [Enrollment class as per section 3.2 REST API spec]
│   │   │   │   └── enroll.js
│   │   │   └── profile -- [Profile class as per section 4.2 REST API spec except Deploy Profile]
│   │   │       ├── profile.js -- [Profile class with methods for Write, Read and Delete profile]
│   │   │       ├── email.js -- [email class with methods for writing email profile params to DB]
│   │   │       └── restrictions.js [Restrictions class with methods for writing restrictions params to DB]
│   │   └── routes -- [N/A]
│   ├── device -- [This folder will contain the business logic to handle all the communication which
                    happen between browser, server and device. This will also handle all the requests 
                    between device and server.]
│   │   ├── controller -- [Controller will have different classes to handle all the MDM commands.]
│   │   │   └── mobile
│   │   │       ├── command.js -- [handle the business logic of all the MDM commands and send it to
                                    mobile]
│   │   │       └── mobile.js -- [handles the business logic to process all the commands coming from browser and 
                                  device and send it to the command class.]
│   │   └── route
│   │       └── index.js -- [parses the requests coming from mobile]
│   ├── model -- [Common DB folder for all DB related activities. All modules will fetch data from the DB modules]
│   └── security -- [Methods to verify the authentication ID coming as part of URL requests]
├── config -- [Contains all the config related operations. The winston log files should be kept here. Also the log
                folder should be here.]
├── meem.js -- [Starts the HTTP server and parses the /meem/ URI and passes to respective 
                    modules. All the URI requests coming from browser or device will have to 
                    contain '/meem' keyword]
├── node_modules
├── package.json
├── static -- [All the HTML files]
├── utils -- [Utility APIs]
└── vendor -- [Certificates]
