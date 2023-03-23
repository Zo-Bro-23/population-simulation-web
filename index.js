const populationSimulation = require('population-simulation')

document.getElementById('button').onclick = () => {
    setTimeout(() => {
        window.scroll(0, document.body.scrollHeight)
    }, 100)
    const starting = parseInt(document.getElementById('starting').value || 20000)
    const p = parseFloat(document.getElementById('p').value || 0.6)
    const offspring = parseInt(document.getElementById('offspring').value || 2)
    const generations = parseInt(document.getElementById('generations').value || 3)
    const variation = [parseFloat(document.getElementById('variation-0').value || 0.01), parseInt(document.getElementById('variation-1').value || 3)]
    const survivalRate = {
        pp: parseFloat(document.getElementById('survival-pp').value || 1),
        pq: parseFloat(document.getElementById('survival-pq').value || 1),
        qq: parseFloat(document.getElementById('survival-qq').value || 0.9)
    }
    const limit = document.getElementById('limit').checked
    let log = document.getElementById('log').value

    if (log == '0') {
        log = generations
    }

    if (starting == NaN || starting < 1) {
        document.getElementById('result').innerHTML = 'Starting population must be a number greater than 0'
        return
    } else if (p == NaN || p < 0 || p > 1) {
        document.getElementById('result').innerHTML = 'p must be a number between 0 and 1'
        return
    } else if (offspring == NaN || offspring < 1) {
        document.getElementById('result').innerHTML = 'Offspring must be a number greater than 0'
        return
    } else if (generations == NaN || generations < 1) {
        document.getElementById('result').innerHTML = 'Generations must be a number greater than 0'
        return
    } else if (variation[0] == NaN || variation[0] < 0 || variation[0] > 1) {
        document.getElementById('result').innerHTML = 'Variation frequency must be a number between 0 and 1'
        return
    } else if (variation[1] == NaN || variation[1] < 1) {
        document.getElementById('result').innerHTML = 'Variation offspring must be a number greater than 0'
        return
    } else if (survivalRate.pp == NaN || survivalRate.pp < 0 || survivalRate.pp > 1) {
        document.getElementById('result').innerHTML = 'Survival rate (pp) must be a number between 0 and 1'
        return
    } else if (survivalRate.pq == NaN || survivalRate.pq < 0 || survivalRate.pq > 1) {
        document.getElementById('result').innerHTML = 'Survival rate (pq) must be a number between 0 and 1'
        return
    } else if (survivalRate.qq == NaN || survivalRate.qq < 0 || survivalRate.qq > 1) {
        document.getElementById('result').innerHTML = 'Survival rate (qq) must be a number between 0 and 1'
        return
    } else if ((limit ? ((starting * offspring * generations) / 102400000) : (starting * (offspring ** generations) / 10240000)) > 1) {
        document.getElementById('result').innerHTML = 'The simulation will take too long to run<br>Please reduce the starting population, offspring, or generations'
        return
    }

    let computation = starting * (offspring ** generations - 1)/(generations - 2)

    if (generations == 1) {
        computation = starting * offspring
    }

    const button = document.getElementById('button')
    const h3 = document.getElementById('result')

    // button.disabled = true

    let currentGeneration = 1

    const generationLogs = []

    const logGenerations = []

    for (i = 1; i < generations / log; i++) {
        logGenerations.push(log * i)
    }

    const results = populationSimulation.nonEquilibrium({
        p, starting, offspring, generations, variation, survivalRate, limitPopulation: limit, verbose: generationLog => {
            console.log(currentGeneration, generationLog)
            if (logGenerations.includes(currentGeneration)) {
                generationLogs.push(`<b> Generation ${currentGeneration}</b><br>${formatResults(generationLog)}`)
            }
            currentGeneration++
        }
    })
    console.log(results)
    generationLogs.push(`<b> Final Generation</b><br>${formatResults(results)}`)
    h3.innerHTML = generationLogs.join('<br><br>')
}

document.getElementById('cleartext').onclick = () => {
    document.getElementById('result').innerHTML = ''
    document.getElementById('button').disabled = false
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

function formatResults(results) {
    return `Total offspring: ${results.totalOffspring}<br>Number of offspring (pp): ${results.totalPP}<br>Number of offspring (pq): ${results.totalPQ}<br>Number of offspring (qq): ${results.totalQQ}<br>Allele frequency (p): ${results.p * 100}%<br>Allele frequency (q): ${results.q * 100}%<br>Genotype frequency (pp): ${results.pp * 100}%<br>Genotype frequency (pq): ${results.pq * 100}%<br>Genotype frequency (qq): ${results.qq * 100}%`
}

eventListeners(['starting', 'p', 'offspring', 'generations', 'variation-0', 'variation-1', 'survival-pp', 'survival-pq', 'survival-qq', 'log'])