import GbVatNumber from '../gbVatNumber.js'
import doFetch from '../fetch.js'

import HmrcVatCheckerV1Config from './config.js'
import {
  HmrcVatCheckerV1Response
} from './response.js'

class HmrcVatCheckerV1 {
  constructor(config) {
    this.config = new HmrcVatCheckerV1Config(config)

    if (!this.config.silenceWarning) {
      console.warn('HmrcVatCheckerV1 is very soon to be deprecated by HMRC, you should switch to HmrcVatCheckerV2 urgently')
      console.warn('This warning can be suppressed with `silenceWarning` in the instantiator')
    }
  }

  async #performVatCheck(targetVat, requesterVat = null) {
    const url = 
      `${this.config.baseUrl}/organisations/vat/check-vat-number/lookup/` +
      `${targetVat.number}` +
      (requesterVat ? `/${requesterVat.number}` : '')

    const res = await doFetch(url, {
      method: 'GET'
    })

    if (res.status === 200) {
      // success

      const data = await res.json()

      return new HmrcVatCheckerV1Response({
        exists: true,
        ...data
      })
    } else if (res.status === 404) {
      // not found

      return new HmrcVatCheckerV1Response({
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

export default HmrcVatCheckerV1