// data-toggle="modal"
// data-target="#..."

const find = Array.prototype.find

function setModalVisibility(e) {
  const isTabTrigger = x => x.dataset.toggle === 'modal'
  const triggers = e.currentTarget.querySelectorAll('[data-toggle="modal"]')
  const node = find.call(triggers, node => node === e.target || node.contains(e.target))

  if (!node) { return }
  e.preventDefault()
  const selector = node.dataset.target
  const modal = document.querySelector(selector)
  
  modal.style.display = 'flex'

  const closeButton = modal.querySelector('[data-dismiss="modal"]')
  const close = () => { 
    modal.style.display = 'none'
    closeButton.removeEventListener('click', close)
  }
  closeButton.addEventListener('click', close)
}

function modal() {
  document.addEventListener('click', setModalVisibility)
}

module.exports = modal
