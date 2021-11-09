class DiscountService {
    constructor() {
        this.personAppears = [];
    }

    getPersonAppears = () => {
        return this.personAppears;
    }

    addPerson = (name) => {
            this.personAppears.push(name)
    }

    checkEvery3Appears = (name) => {
        const getPersonAppears = this.getPersonAppears();
        const personAppears = getPersonAppears.filter((person) => person === name);
        if (personAppears.length === 0 ) {
            return false
        }
        return personAppears.length % 3 === 0;
    }

    getDiscount = discount => {
        return discount >= 0 ? discount : 0
    }

    discount = discount => {
        const getDiscount = this.getDiscount(discount)
        return getDiscount/100
    }

    discountSum = (sum, discount) => {
        const discountSum = this.discount(discount)
        return Math.ceil(sum * discountSum)
    }

    makeDiscount = (name, sum, discount) => {
        const checkEvery3Appears = this.checkEvery3Appears(name)
        if (checkEvery3Appears) {
            const discountSum = this.discountSum(sum, discount)
            return discountSum;
        }
    }
}

const discountService = new DiscountService();

module.exports = discountService;