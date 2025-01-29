import GbVatNumber from '../gbVatNumber.js'
import doFetch from '../fetch.js'

import HmrcVatCheckerV2Config from './config.js'
import {
  HmrcVatCheckerV2Response
} from './response.js'

class HmrcVatCheckerV2 {
  #autoRenewTimer

  constructor(config) {
    this.config = new HmrcVatCheckerV2Config(config)
  }

  async #performVatCheck(targetVat, requesterVat = null) {
    // are we authenticated?
    if(
      !this.config.accessToken ||
      Date.now() >= this.config.accessTokenExpiresAt
    ) {
      await this.authenticate()
    }

    const url = 
      `${this.config.baseUrl}/organisations/vat/check-vat-number/lookup/` +
      `${targetVat.number}` +
      (requesterVat ? `/${requesterVat.number}` : '')

    const res = await doFetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.config.accessToken}`,
        'Accept': 'application/vnd.hmrc.2.0+json'
      }
    })

    if (res.status === 200) {
      // success

      const data = await res.json()

      return new HmrcVatCheckerV2Response({
        exists: true,
        ...data
      })
    } else if (res.status === 404) {
      // not found

      return new HmrcVatCheckerV2Response({
        exists: false
      })
    } else if (res.status === 429) {
      throw new Error('Rate limit exceeded')
    } else if (res.status === 400) {
      // invalid format - should never happen due to pre-check

      throw new Error('VAT number is not in a valid format')
    } else {
      throw new Error(`Unknown error ${res.status}`)
    }
  }

  async authenticate() {
    const url = `${this.config.baseUrl}/oauth/token`
    const body = new URLSearchParams({
      'grant_type': 'client_credentials',
      'client_id': this.config.clientId,
      'client_secret': this.config.clientSecret,
      'scope': 'read:vat'
    })

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body
    })

    if(resp.status === 200) {
      const data = await resp.json()

      const preExpires = (Date.now() + data.expires_in)

      this.config.accessToken = data.access_token
      this.config.accessTokenExpiresAt = preExpires

      if(this.config.autoRenewAccessToken) {
        const autoRenewIn = (data.expires_in - this.config.earlyRenewalDuration) * 1000

        if(this.#autoRenewTimer) {
          clearInterval(this.#autoRenewTimer)
        }

        this.#autoRenewTimer = setTimeout(() => {
          this.authenticate()
        }, autoRenewIn)
      }
    } else {
      const data = await resp.json()

      throw new Error(`Failed to authenticate with HMRC: ${data.error_description}`)
    }
  }

  async checkVatNumber(targetVrn) {
    const targetVat = new GbVatNumber(targetVrn)

    return this.#performVatCheck(targetVat)
  }

  async checkVatNumberWithReference(targetVrn, requesterVrn) {
    const targetVat = new GbVatNumber(targetVrn)
    const requesterVat = new GbVatNumber(requesterVrn)

    return this.#performVatCheck(targetVat, requesterVat)
  }
}

export default HmrcVatCheckerV2