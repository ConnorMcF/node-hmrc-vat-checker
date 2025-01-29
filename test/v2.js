import { expect } from 'chai'

import testData from './testData.js'

import { HmrcVatCheckerV2 } from '../lib/index.js'

import GbVatNumber from '../lib/gbVatNumber.js'
import {
  HmrcVatCheckerV2Response,
  HmrcVatCheckerV2ResponseAddress
} from '../lib/v2/response.js'

const isGithubRunner = !!process.env.IS_GITHUB_ACTION

describe('v2 API', () => {

  let vatChecker

  before(() => {
    if(
      !process.env.CLIENT_ID ||
      !process.env.CLIENT_SECRET
    ) {
      throw new Error('Please set CLIENT_ID and CLIENT_SECRET environment variables')
    }
  })

  describe('initialise', function() {
    it('should initialise', () => {
      vatChecker = new HmrcVatCheckerV2({
        env: 'sandbox',
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        autoRenewAccessToken: false // causes tests to hang due to timeout
      })

      expect(vatChecker).to.be.an.instanceOf(HmrcVatCheckerV2)
    })
  })

  describe('validations', function() {
    this.slow(1000)

    // avoid rate limits
    // GH runners do 3 concurrent so divide further
    const hmrcRequestInterval = 1000 / (3 / (isGithubRunner ? 3 : 1))
    beforeEach(done => setTimeout(done, hmrcRequestInterval))

    for(const testKey in testData) {
      const test = testData[testKey]
  
      it(`should validate ${testKey}`, async () => {
        const resp = await vatChecker.checkVatNumber(testKey)

        expect(resp).to.be.an.instanceOf(HmrcVatCheckerV2Response)
        expect(resp.exists).to.be.true
        expect(resp.name).to.equal(test.name)
        expect(resp.vatNumber.number).to.equal(test.vatNumber)

        expect(resp.address).to.be.an.instanceOf(HmrcVatCheckerV2ResponseAddress)
        expect(resp.address.line1).to.equal(test.address.line1)
        expect(resp.address.line2).to.equal(test.address.line2)
        expect(resp.address.postcode).to.equal(test.address.postcode)
        expect(resp.address.countryCode).to.equal(test.address.countryCode)

        expect(resp.requesterVatNumber).to.be.null
        expect(resp.consultationNumber).to.be.null

        expect(resp.processingDate).to.be.an.instanceOf(Date)
      })

      it(`should validate ${testKey} with reference`, async () => {
        const resp = await vatChecker.checkVatNumberWithReference(testKey, '896040675996')

        expect(resp).to.be.an.instanceOf(HmrcVatCheckerV2Response)
        expect(resp.exists).to.be.true
        expect(resp.name).to.equal(test.name)
        expect(resp.vatNumber.number).to.equal(test.vatNumber)

        expect(resp.address).to.be.an.instanceOf(HmrcVatCheckerV2ResponseAddress)
        expect(resp.address.line1).to.equal(test.address.line1)
        expect(resp.address.line2).to.equal(test.address.line2)
        expect(resp.address.postcode).to.equal(test.address.postcode)
        expect(resp.address.countryCode).to.equal(test.address.countryCode)

        expect(resp.requesterVatNumber).to.an.instanceOf(GbVatNumber)
        expect(resp.requesterVatNumber.toString()).to.equal('896040675996')
        expect(resp.consultationNumber).to.be.a('string')

        expect(resp.processingDate).to.be.an.instanceOf(Date)
      })
    }
  
    it('should not validate invalid format', async () => {
      return vatChecker.checkVatNumber('ABC123')
        .then(() => {
          expect.fail('Should not resolve')
        })
        .catch(err => {
          expect(err.message).to.equal('ABC123 is not a valid GB VAT number')
        })
    })

    it('should not validate non-existent number', async () => {
      return vatChecker.checkVatNumber('123456789')
        .then((res) => {
          expect(res).to.be.an.instanceOf(HmrcVatCheckerV2Response)
          expect(res.exists).to.be.false
          expect(res.name).to.be.null
          expect(res.vatNumber).to.be.null
          expect(res.address).to.be.null
          expect(res.processingDate).to.be.null
        })
    })
  })

})