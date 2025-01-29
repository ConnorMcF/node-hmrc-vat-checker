import { HmrcVatCheckerV1 } from '../lib/index.js'

// WARNING!
// The v1 API is very soon to be deprecated by HMRC
// You should switch to the v2 API urgently

const vatChecker = new HmrcVatCheckerV1({
  env: 'sandbox'
})

const check = async () => {
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