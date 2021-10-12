function makeDoge () {
  const doge = document.createElement('p')
  doge.textContent = 'Wow Such a doge'
  document.body.appendChild(doge)
}

export {
  makeDoge
}
