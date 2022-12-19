const newtonMethod = require('newton-method')

document.getElementById('button').onclick = () => {
    let iterations
    let initial
    if (isNaN(document.getElementById('iterations').value !== 'number') || !document.getElementById('iterations').value) {
        iterations = 25
    } else {
        iterations = document.getElementById('iterations').value
    }
    if (isNaN(document.getElementById('initial').value !== 'number') || !document.getElementById('initial').value) {
        initial = 0
    } else {
        initial = document.getElementById('initial').value
    }
    if (!document.getElementById('text').value) {
        document.getElementById('result').innerHTML = 'Please enter a function!'
    } else {
        document.getElementById('result').innerHTML = `Result: ${newtonMethod(document.getElementById('text').value, iterations, initial)}`
    }
}

document.getElementById('cleartext').onclick = () => {
    document.getElementById('result').innerHTML = ''
    document.getElementById('text').value = ''
    document.getElementById('initial').value = ''
    document.getElementById('iterations').value = ''
}

document.getElementById('text').addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault()
        document.getElementById("button").click()
    }
})

document.getElementById('initial').addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault()
        document.getElementById("button").click()
    }
})

document.getElementById('iterations').addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault()
        document.getElementById("button").click()
    }
})