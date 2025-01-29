class HmrcVatCheckerV2Config {
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

    this.clientId = data.clientId || null
    this.clientSecret = data.clientSecret || null

    if(!this.clientId) {
      throw new Error('clientId is required')
    }
    if(!this.clientSecret) {
      throw new Error('clientSecret is required')
    }

    this.accessToken = data.accessToken || null

    // should we automatically renew, or only when a request is made?
    this.autoRenewAccessToken = data.autoRenewAccessToken || true
    // renew this many seconds before expiry
    this.earlyRenewalDuration = data.earlyRenewalDuration || 60
  }
}

export default HmrcVatCheckerV2Config