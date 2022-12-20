(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const populationSimulation = require('population-simulation')

document.getElementById('button').onclick = () => {
    setTimeout(() => {
        window.scroll(0, document.body.scrollHeight)
    }, 100)
    const starting = document.getElementById('starting').value || 20000
    const p = document.getElementById('p').value || 0.6
    const offspring = document.getElementById('offspring').value || 2
    const generations = document.getElementById('generations').value || 3
    const variation = [document.getElementById('variation-0').value || 0.01, document.getElementById('variation-1').value || 3]
    const survivalRate = {
        pp: document.getElementById('survival-pp').value || 1,
        pq: document.getElementById('survival-pq').value || 1,
        qq: document.getElementById('survival-qq').value || 0.9
    }
    const limit = document.getElementById('limit').checked

    if (parseInt(starting) == NaN || parseInt(starting) < 1) {
        document.getElementById('result').innerHTML = 'Starting population must be a number greater than 0'
        return
    } else if (parseFloat(p) == NaN || parseFloat(p) < 0 || parseFloat(p) > 1) {
        document.getElementById('result').innerHTML = 'p must be a number between 0 and 1'
        return
    } else if (parseInt(offspring) == NaN || parseInt(offspring) < 1) {
        document.getElementById('result').innerHTML = 'Offspring must be a number greater than 0'
        return
    } else if (parseInt(generations) == NaN || parseInt(generations) < 1) {
        document.getElementById('result').innerHTML = 'Generations must be a number greater than 0'
        return
    } else if (parseFloat(variation[0]) == NaN || parseFloat(variation[0]) < 0 || parseFloat(variation[0]) > 1) {
        document.getElementById('result').innerHTML = 'Variation frequency must be a number between 0 and 1'
        return
    } else if (parseInt(variation[1]) == NaN || parseInt(variation[1]) < 1) {
        document.getElementById('result').innerHTML = 'Variation offspring must be a number greater than 0'
        return
    } else if (parseFloat(survivalRate.pp) == NaN || parseFloat(survivalRate.pp) < 0 || parseFloat(survivalRate.pp) > 1) {
        document.getElementById('result').innerHTML = 'Survival rate (pp) must be a number between 0 and 1'
        return
    } else if (parseFloat(survivalRate.pq) == NaN || parseFloat(survivalRate.pq) < 0 || parseFloat(survivalRate.pq) > 1) {
        document.getElementById('result').innerHTML = 'Survival rate (pq) must be a number between 0 and 1'
        return
    } else if (parseFloat(survivalRate.qq) == NaN || parseFloat(survivalRate.qq) < 0 || parseFloat(survivalRate.qq) > 1) {
        document.getElementById('result').innerHTML = 'Survival rate (qq) must be a number between 0 and 1'
        return
    }

    const button = document.getElementById('button')
    const h3 = document.getElementById('result')

    button.disabled = true
    const results = populationSimulation.nonEquilibrium(p, starting, offspring, generations, variation, survivalRate, limit)
    h3.innerHTML = `Total offspring: ${results.totalOffspring}<br>Number of offspring (pp): ${results.totalPP}<br>Number of offspring (pq): ${results.totalPQ}<br>Number of offspring (qq): ${results.totalQQ}<br>Allele frequency (p): ${results.p * 100}%<br>Allele frequency (q): ${results.q * 100}%<br>Genotype frequency (pp): ${results.pp * 100}%<br>Genotype frequency (pq): ${results.pq * 100}%<br>Genotype frequency (qq): ${results.qq * 100}%`
}

document.getElementById('cleartext').onclick = () => {
    document.getElementById('result').innerHTML = ''
    document.getElementById('starting').value = ''
    document.getElementById('p').value = ''
    document.getElementById('offspring').value = ''
    document.getElementById('generations').value = ''
    document.getElementById('variation-0').value = ''
    document.getElementById('variation-1').value = ''
    document.getElementById('survival-pp').value = ''
    document.getElementById('survival-pq').value = ''
    document.getElementById('survival-qq').value = ''
    document.getElementById('limit').checked = false
    document.getElementById('button').disabled = false
}

function eventListeners(ids) {
    ids.forEach(id => {
        document.getElementById(id).addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                event.preventDefault()
                document.getElementById("button").click()
            }
        })
    })
}

eventListeners(['starting', 'p', 'offspring', 'generations', 'variation-0', 'variation-1', 'survival-pp', 'survival-pq', 'survival-qq'])
},{"population-simulation":3}],2:[function(require,module,exports){
function dynamicGeneration(p = 0.6, starting = 2000, offspring = 2, generations = 3, variation = [0.01, 3]) {
    const nonEquilibrium = require('./nonEquilibrium')
    return nonEquilibrium(p, starting, offspring, generations, variation, {
        pp: 1,
        pq: 1,
        qq: 1
    })
}

module.exports = dynamicGeneration
},{"./nonEquilibrium":5}],3:[function(require,module,exports){
const singleGeneration = require('./singleGeneration')
const multiGeneration = require('./multiGeneration')
const dynamicGeneration = require('./dynamicGeneration')
const nonEquilibrium = require('./nonEquilibrium')

module.exports = {
    singleGeneration,
    multiGeneration,
    dynamicGeneration,
    nonEquilibrium
}
},{"./dynamicGeneration":2,"./multiGeneration":4,"./nonEquilibrium":5,"./singleGeneration":6}],4:[function(require,module,exports){
function multiGeneration(p = 0.6, starting = 2000, offspring = 2, generations = 3) {
    const dynamicGeneration = require('./dynamicGeneration')
    return dynamicGeneration(p, starting, offspring, generations, [0, 0])
}

module.exports = multiGeneration
},{"./dynamicGeneration":2}],5:[function(require,module,exports){
function nonEquilibrium(p = 0.6, starting = 20000, offspring = 2, generations = 3, variation = [0.01, 3], survivalRate = {
    pp: 1,
    pq: 1,
    qq: 0.9
}, limitPopulation = false, verbose = false) {

    return processResults(singleGeneration(p, starting, 1, 0))

    function singleGeneration(xp, xoffspring, xgenerations, xindex) {
        let results = {
            pp: 0,
            pq: 0,
            qq: 0
        }
        let population = []
        let totalOffspring = 0

        for (ko = 0; ko < xgenerations; ko++) {
            let currentOffspring = xoffspring
            const upOrDown = Math.random()
            for (k = 0; k < variation[1]; k++) {
                const chances = Math.random()
                if (chances <= variation[0]) {
                    if (upOrDown <= 0.5) {
                        currentOffspring += 1
                    } else {
                        currentOffspring -= 1
                    }
                } else {
                    break
                }
            }
            for (i = 0; i < currentOffspring; i++) {
                const a = Math.random()
                const b = Math.random()
                let aAllele = ''
                let bAllele = ''

                if (a <= xp) {
                    aAllele = 'p'
                } else {
                    aAllele = 'q'
                }

                if (b <= xp) {
                    bAllele = 'p'
                } else {
                    bAllele = 'q'
                }

                if (aAllele + bAllele == 'qp') {
                    aAllele = 'p'
                    bAllele = 'q'
                }

                if (Math.random() <= survivalRate[aAllele + bAllele]) {
                    results[aAllele + bAllele] += 1
                    population.push(aAllele + bAllele)
                    totalOffspring++
                }
            }
        }

        results.population = population
        results.totalOffspring = totalOffspring

        if (xindex < generations) {
            if (verbose) {
                console.log(processResults(results))
            }
            return singleGeneration((results.pp * 2 + results.pq) / (totalOffspring * 2), offspring, limitPopulation ? starting : totalOffspring, xindex + 1)
        } else {
            return results
        }
    }
}

function processResults(results) {
    let qresults = { ...results }
    qresults.p = (qresults.pp * 2 + qresults.pq) / (qresults.totalOffspring * 2)
    qresults.q = (qresults.qq * 2 + qresults.pq) / (qresults.totalOffspring * 2)
    qresults.totalPP = qresults.pp
    qresults.totalPQ = qresults.pq
    qresults.totalQQ = qresults.qq
    qresults.pp = qresults.pp / qresults.totalOffspring
    qresults.pq = qresults.pq / qresults.totalOffspring
    qresults.qq = qresults.qq / qresults.totalOffspring

    return qresults
}

module.exports = nonEquilibrium
},{}],6:[function(require,module,exports){
function singleGeneration(p = 0.6, starting = 2000, offspring = 2) {
    const multiGeneration = require('./multiGeneration')
    return multiGeneration(p, starting, offspring, 1)
}

module.exports = singleGeneration
},{"./multiGeneration":4}]},{},[1]);
