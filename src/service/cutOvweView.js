export default function cutOverView(selector) {
	const overviewBlocks = document.querySelectorAll(selector)
	overviewBlocks.forEach(el => {
		if (el.clientHeight) {
			while (el.scrollHeight > el.clientHeight) {
				const lastSpace = el.textContent.lastIndexOf(' ')
				el.textContent = `${el.textContent.slice(0, lastSpace)}...`
			}
		}
	})
}
