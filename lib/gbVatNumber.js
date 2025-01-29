const gbVatPattern = /^([GB])*(([0-9]\d{8})|([0-9]\d{11}))$/
const vatPattern = /^[a-zA-Z]{2}[0-9]\d{1,12}$/

class GbVatNumber {
  constructor(input) {
    const patternMatch = gbVatPattern.test(input)

    if (!patternMatch) {
      const isProbablyVat = vatPattern.test(input)

      if(isProbablyVat) {
        throw new Error(`${input} must be specifically a GB VAT number`)
      } else {
        throw new Error(`${input} is not a valid GB VAT number`)
      }
    }

    this.number = input.replace('GB', '')
  }

  toString() {
    return this.number
  }
  toIntVatNumber() {
    return `GB${this.number}`
  }
}

export default GbVatNumber