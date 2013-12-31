# DynupdateAWS [![NPM version](https://badge.fury.io/js/dynupdate-aws.png)](http://badge.fury.io/js/dynupdate-aws) [![Build Status](https://travis-ci.org/darul75/dynupdate-aws.png?branch=master)](https://travis-ci.org/darul75/dynupdate-aws) [![Total views](https://sourcegraph.com/api/repos/github.com/darul75/dynupdate-aws/counters/views.png)](https://sourcegraph.com/github.com/darul75/dynupdate-aws)

**DynupdateAWS** NodeJS module to update no-ip and submit your AWS instance IP as a dynamic dns update request.

## Why ?

Because ecchymose in the nose. IP may change my friend and DNS has to be updated.

At AWS instance boot, you might want to send IP update to your no-ip DNS.

It works as a daemon and will trigger an DNS update when AWS IP instance is known.

Timer checks aws instance status about every 5 seconds, when public IP is provided, event is triggered and update request sent to no-ip.

Combined with https://github.com/chovy/node-startup on your aws instance, can be a great deal to avoid elastic IP.

## Install

~~~
npm install dynupdate-aws
~~~

## Usage

### Command line
```
node dynupdate-aws.js <AWS-accessKeyId> <AWS-secretAccessKey> <AWS-region> <AWS-instanceId> <NO-IP-auth> <NO-IP-hostname>
```

### Application
```javascript
var dynupdateAws = require('dynupdate-aws');

dynupdateAws.daemon(
  {
    accessKeyId: '', 
    secretAccessKey:'', 
    region: '', 
    instanceId: '',
    auth: '',
    hostname:''
  }, 
  function(err, status) {
  // process err
  
  }
);
```

## Options

* `accessKeyId` AWS accessKeyId
* `secretAccessKey` AWS secretAccessKey
* `region` AWS region
* `instanceId` AWS instance id
* `auth` NO-IP user:password ( email / mdp )
* `hostname` NO-IP hostname
        
## Return    

### status
* `ok` job is done

### err
* `nohost`  Error Hostname supplied does not exist under specified account, client exit and require user to enter new login credentials before performing and additional request.
* `badauth`  Error Invalid username password combination
* `badagent` Error Client disabled. Client should exit and not perform any more updates without user intervention.
* `!donator` Error An update request was sent including a feature that is not available to that particular user such as offline options.
* `abuse` Error Username is blocked due to abuse. Either for not following our update specifications or disabled due to violation of the No-IP terms of service. Our terms of service can be viewed at http://www.noip.com/legal/tos. Client should stop sending updates.
* `911` Error A fatal error on our side such as a database outage. Retry the update no sooner 30 minutes.
~~~

## License

The MIT License (MIT)

Copyright (c) 2013 Julien Valéry

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
