class HmrcVatCheckerV1Config {
  constructor(data = {}) {
    this.env = data.env || 'production'
    this.baseUrl =
      data.baseUrl ||
      this.env === 'sandbox' ? 'https://test-api.service.hmrc.gov.uk' : 
      this.env === 'production' ? 'https://api.service.hmrc.gov.uk' :
      null

    if(!this.baseUrl) {
      throw new Error('baseUrl is required, is your env valid?')
    }
    
    this.silenceWarning = data.silenceWarning || false
  }
}

export default HmrcVatCheckerV1Config