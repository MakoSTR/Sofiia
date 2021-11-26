class SpoilingService {
    getSpoilingRate = spoilingRate => {
        return spoilingRate >= 0 ? spoilingRate : 0;
    }

    randomizer = () => {
        console.log(Math.floor(Math.random() * 3))
        return Math.random();
    }

}

const spoilingService = new SpoilingService();

module.exports = spoilingService;

spoilingService.randomizer();