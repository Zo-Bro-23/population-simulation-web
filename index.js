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