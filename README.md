## Synopsis

Crunchable is an API for executing tasks that require Intelligence (ranging from OCR/speech-to-text through Text Classification and even Web Scraping).
Anything a human can do, crunchable does better (with a unique blend of realtime-available humans and ML algorithms).

## Installation

  Grab your API Token from <https://crunchable.io/> and then simply:
  `npm install crunchable`

## Code Example

``` javascript
const crunchable = require("crunchable")(
  "test_e53bbf19fdd077eda1cd933a54ebe987" // replace with your own API Token
);

crunchable.requestMultipleChoice({
  instruction: "Does the image contain violent content?",
  attachments_type: "image",
  attachments: [ "http://i.imgur.com/qRWH5.jpg" ],
  choices_type: "text",
  choices: [ "no violence", "mild violence", "intense violence" ]
}).then(function (request) {
  console.log('request', request.id, 'queued for execution');
  crunchable.waitForRequest(request.id).then(function (completed_request) {
    console.log('got response:', completed_request.response);
  });
});

```

## API Reference

For more information, code examples, and a complete API refrence, visit:

<https://crunchable.io/docs/>

## Help & Support

For help or support, either write to us at the crunchable.io website :

<https://crunchable.io/contact.html>

or email us at support@crunchable.io 
