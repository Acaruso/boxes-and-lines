function userFunction(logger) {
    var MAX_INT = Number.MAX_SAFE_INTEGER;

    function helper(i, coins, amount, parentId) {
        // var id = logger.newNode("i: " + i + ", coins: " + coins + ", amount: " + amount, parentId);
        var id = logger.newNode("i: " + i, parentId);
        if (amount === 0) {
            return 0;
        }

        if (i < coins.length && amount > 0) {
            var curCoin = coins[i];
            var maxNumCoins = Math.floor(amount / curCoin);
            var minCost = MAX_INT

            for (var numCoins = 0; numCoins <= maxNumCoins; numCoins++) {
                if (numCoins * curCoin <= amount) {
                    res = helper(i + 1, coins, amount - (numCoins * curCoin), id);

                    if (res !== -1) {
                        minCost = Math.min(minCost, res + numCoins);
                    }
                }
            }

            if (minCost === MAX_INT) {
                return -1;
            } else {
                return minCost
            }
        }

        return -1;
    }

    function coinChange(coins, amount) {
        return helper(0, coins, amount, null)
    }

    var coins = [5, 1, 2];
    var amount = 11;

    // var coins = [186,419,83,408];
    // var amount = 6249;

    var res = coinChange(coins, amount);
    console.log('res: ' + res);
}
