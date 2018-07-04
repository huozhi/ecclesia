const find = Array.prototype.find

function setTabVisibility(e) {
  const isTabTrigger = x => x.dataset.toggle === 'tab'
  const triggers = e.currentTarget.querySelectorAll('[data-toggle="tab"]')
  const node = find.call(triggers, node => node === e.target || node.contains(e.target))

  if (!node) { return  }
  
  e.preventDefault()
  const selector = node.getAttribute('href')
  const allTabs = document.querySelectorAll('.tab-content .tab-pane')
  const visibleTabs = document.querySelectorAll(selector)
  
  allTabs.forEach(tab => { tab.classList.remove('active') })
  visibleTabs.forEach(tab => { tab.classList.add('active') })
}

function tab() {
  document.addEventListener('click', setTabVisibility)
}

module.exports = tab
