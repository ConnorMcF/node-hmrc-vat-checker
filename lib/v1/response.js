import GbVatNumber from '../gbVatNumber.js'

class HmrcVatCheckerV1ResponseAddress {
  constructor(data) {
    this.line1 = data.line1 ? data.line1 : null
    this.line2 = data.line2 ? data.line2 : null
    this.postcode = data.postcode ? data.postcode : null
    this.countryCode = data.countryCode ? data.countryCode : null
  }
}

class HmrcVatCheckerV1Response {
  constructor(data) {
    this.exists = data.exists

    this.name = data.target ? data.target.name : null
    this.vatNumber = data.target ? new GbVatNumber(data.target.vatNumber) : null
    this.address = data.target ? new HmrcVatCheckerV1ResponseAddress(data.target.address) : null
    
    this.requesterVatNumber = data.requester ? new GbVatNumber(data.requester) : null
    this.consultationNumber = data.consultationNumber ? data.consultationNumber : null

    this.processingDate = data.processingDate ? new Date(data.processingDate) : null
  }
}

export {
  HmrcVatCheckerV1Response,
  HmrcVatCheckerV1ResponseAddress
}