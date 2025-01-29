# HMRC VAT Checker

This library allows you to check UK VAT numbers against the HMRC APIs.

```js
import { HmrcVatCheckerV2 } from 'hmrc-vat-checker'

const vatChecker = new HmrcVatCheckerV2({
  env: 'sandbox', // or 'production'
  clientId: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  clientSecret: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
})

const vatNumberToCheck = '245719348'

vatChecker.checkVatNumber(vatNumberToCheck)
  .then(resp => {
    /*
    -> HmrcVatCheckerV2Response {
        exists: true,
        name: 'BRITISH TELECOMMUNICATIONS PUBLIC LIMITE D COMPANY',
        vatNumber: GbVatNumber { number: '245719348' },
        address: HmrcVatCheckerV2ResponseAddress {
          line1: '1 BRAHAM STREET',
          line2: 'LONDON',
          postcode: 'E1 8EE',
          countryCode: 'GB'
        },
        requesterVatNumber: null,
        consultationNumber: null,
        processingDate: 2025-01-29T12:00:00.000Z
      }
    */
  })
  .catch(err => {
    // # Error while checking
    // Non-existent VAT numbers will resolve the promise with
    //   HmrcVatCheckerV2Response.exists === false
    // Invalid VAT number will error here
    // API errors will error here
  })

// VAT Numbers can be optionally prefixed with 'GB'
const ourVatNumber = 'GB245719348'

// Get a HMRC consultation reference number with our check as well
vatChecker.checkVatNumberWithReference(vatNumberToCheck, ourVatNumber)
  .then(resp => {
    /*
    -> HmrcVatCheckerV2Response {
        // ... standard response plus:
        requesterVatNumber: GbVatNumber { number: '245719348' },
        consultationNumber: 'XXX-XXX-XXX',
        // ...
      }
    */
  })
```

## Example

Examples are available in the [examples folder](https://github.com/ConnorMcF/node-hmrc-vat-checker/tree/master/examples).

## How to get credentials?

1) **Create an account on the HMRC Developer Hub**
   
   Further instructions can be found at https://developer.service.hmrc.gov.uk/api-documentation/docs/using-the-hub

2) **Create sandbox credentials**

   You will need to generate a client ID and client secret, store these securely and use them to instantiate this library. You can now use the sandbox environment with the [mock VAT registration numbers](https://github.com/hmrc/vat-registered-companies-api/tree/main/public/api/conf/1.0/test-data).

3) **Get production credentials**

   Once you're ready, you can apply to go live on the HMRC Developer Hub. This library should already comply with the technical requirements set out by HMRC, but you will have to assess your own compliance with the questions they ask you.

4) **Use your production credentials**

   You can now set the library environment to `env: production` by updating the instantiator.