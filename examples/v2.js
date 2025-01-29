import { HmrcVatCheckerV2 } from '../lib/index.js'

const vatChecker = new HmrcVatCheckerV2({
  env: 'sandbox',
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
})

// Please bear in mind, while in sandbox mode you cannot check against real VAT
// numbers, only the mock VAT registration numbers provided by HMRC. See:
// https://github.com/hmrc/vat-registered-companies-api/tree/main/public/api/conf/1.0/test-data
// or test/testData.js for examples of these mock numbers.

const check = async () => {
  // Authenticating initially isn't required, but is good practice to ensure the
  // credentials are working. If you don't authenticate here, the first request
  // will authenticate automatically.
  await vatChecker.authenticate()

  // VAT numbers can be only numbers, or be prefixed with GB
  const vatNumberToCheck = 'GB896040675996'

  // Check a VAT number
  const res = await vatChecker.checkVatNumber(vatNumberToCheck)
  console.log(res)

  const ourVatNumber = '132877896459'

  // Check a VAT number with a reference
  const res2 = await vatChecker.checkVatNumberWithReference(vatNumberToCheck, ourVatNumber)
  console.log(res2.requesterVatNumber, res2.consultationNumber)

  process.exit(0)
}

check()