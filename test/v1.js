import { expect } from 'chai'

import testData from './testData.js'

import { HmrcVatCheckerV1 } from '../lib/index.js'

import GbVatNumber from '../lib/gbVatNumber.js'
import {
  HmrcVatCheckerV1Response,
  HmrcVatCheckerV1ResponseAddress
} from '../lib/v1/response.js'

describe('v1 API', () => {

  let vatChecker

  describe('initialise', function() {
    it('should initialise production', () => {
      const vatCheckerProd = new HmrcVatCheckerV1({
        env: 'production'
      })

      expect(vatCheckerProd).to.be.an.instanceOf(HmrcVatCheckerV1)
    })

    it('should initialise sandbox', () => {
      vatChecker = new HmrcVatCheckerV1({
        env: 'sandbox'
      })

      expect(vatChecker).to.be.an.instanceOf(HmrcVatCheckerV1)
    })

    it('should throw with an invalid env', () => {
      expect(() => {
        new HmrcVatCheckerV1({
          env: 'fake'
        })
      }).to.throw('baseUrl is required, is your env valid?')
    })
  })

  describe('validations', function() {
    this.slow(1000)

    for(const testKey in testData) {
      const test = testData[testKey]
  
      it(`should validate ${testKey}`, async () => {
        const resp = await vatChecker.checkVatNumber(testKey)

        expect(resp).to.be.an.instanceOf(HmrcVatCheckerV1Response)
        expect(resp.exists).to.be.true
        expect(resp.name).to.equal(test.name)
        expect(resp.vatNumber.number).to.equal(test.vatNumber)

        expect(resp.address).to.be.an.instanceOf(HmrcVatCheckerV1ResponseAddress)
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

        expect(resp).to.be.an.instanceOf(HmrcVatCheckerV1Response)
        expect(resp.exists).to.be.true
        expect(resp.name).to.equal(test.name)
        expect(resp.vatNumber.number).to.equal(test.vatNumber)

        expect(resp.address).to.be.an.instanceOf(HmrcVatCheckerV1ResponseAddress)
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
          expect(res).to.be.an.instanceOf(HmrcVatCheckerV1Response)
          expect(res.exists).to.be.false
          expect(res.name).to.be.null
          expect(res.vatNumber).to.be.null
          expect(res.address).to.be.null
          expect(res.processingDate).to.be.null
        })
    })
  })

})