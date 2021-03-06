const tap = require("tap")
const { ScrollServer, ScrollCli, Scroll, Article, MarkdownFile } = require("./scroll.node.js")

const pathToExample = __dirname + "/example.com/"
const testPort = 5435

const runTree = testTree =>
	Object.keys(testTree).forEach(key => {
		testTree[key](tap.equal)
	})

const testTree = {}

testTree.server = areEqual => {
	const scrollServer = new ScrollServer(pathToExample)
	scrollServer.verbose = false
	const httpServer = scrollServer.startListening(testPort)

	areEqual(!!httpServer, true)

	httpServer.close()
}

testTree.scroll = areEqual => {
	const scroll = new ScrollServer(pathToExample).scroll
	areEqual(scroll.toSingleHtmlFile().includes("music"), true)
}

testTree.fullIntegrationTest = areEqual => {
	const server = new ScrollServer()
	areEqual(!!server, true)
}

testTree.markdown = areEqual => {
	// Arrange
	const mdFile = `# hello world`
	// Act
	const scrollFile = new MarkdownFile(mdFile).toScroll()

	// Assert
	areEqual(mdFile, scrollFile)
}

testTree.article = areEqual => {
	const article = new Article(
		`title About me
hello world`
	)

	areEqual(
		article
			.toStumpNode()
			.toString()
			.includes("scrollArticleCell"),
		true
	)
}

testTree.cli = areEqual => {
	const cli = new ScrollCli()
	cli.verbose = false
	// Act/Assert
	areEqual(cli.helpCommand().includes("help page"), true)

	// Act/Assert
	areEqual(cli.exportCommand(pathToExample).includes("about"), true)

	// Act/Assert
	areEqual(cli.deleteCommand().includes("delete"), true)

	// Act/Assert
	// todo: test no params execute
	// areEqual(cli.execute().includes("help page"), true)

	// Act/Assert
	const httpServer = cli.serveCommand(pathToExample, testPort)
	areEqual(!!httpServer, true)
	httpServer.close()
}

// FS tests:
// scroll missing published folder
// scroll missing settings file
// settings file missing required settings
// bad Scroll files

if (module && !module.parent) runTree(testTree)

module.exports = { testTree }
