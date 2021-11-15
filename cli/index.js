const inquirer = require("inquirer")
const nanoid = require("nanoid").nanoid
const { createWriteStream, writeFile, readFileSync } = require("fs")
const { resolve, basename, extname } = require("path")
const chalk = require("chalk")
const { JSDOM } = require("jsdom")
const glob = require("glob")

const buildPath = path => resolve(__dirname, path)

const existFileNames = getExistFileNames()

let _htmlTitle = "tmp"
var questions = [
  {
    type: "input",
    name: "fileName",
    message: "请输入文件名称",
    default: function () {
      return "template-" + nanoid(4)
    },
    validate: function (value) {
      var pass = value.match(/^[a-zA-Z][\w_-]*$/i)
      if (!pass) {
        return "请输入正确格式的文件名"
      }
      var isExist = existFileNames.includes(value)
      if (isExist) {
        return "当前文件名已存在"
      }
      _htmlTitle = value
      return true
    },
  },
  {
    type: "input",
    name: "htmlTitle",
    message: "请输入页面title",
    default: function () {
      return _htmlTitle
    },
  },
]

inquirer.prompt(questions).then(answers => {
  const { fileName, htmlTitle } = answers
  createStyle(fileName)
  createJS(fileName)
  createHTML(fileName, htmlTitle)
})

function getExistFileNames() {
  const existFiles = glob.sync(buildPath("../src/htmls/**.*"))
  return existFiles.map(item => basename(item, extname(item)))
}

function createStyle(fileName) {
  let data = readFileSync(buildPath("./tmp.styl"), "utf-8")
  data += `

.${fileName}
  font-size 14px
  position relative
  min-height 100vh
  `
  writeFile(buildPath("../src/stylus/" + fileName + ".styl"), data, err => {
    if (!err) {
      console.log(chalk.green("创建style文件成功..."))
    } else {
      console.log(chalk.red("创建style文件失败..." + JSON.stringify(err)))
    }
  })
}

function createJS(fileName) {
  let data = readFileSync(buildPath("./tmp.js"))
  data += `
import '../stylus/${fileName}.styl'
  `
  writeFile(buildPath("../src/scripts/" + fileName + ".js"), data, err => {
    if (!err) {
      console.log(chalk.green("创建js文件成功..."))
    } else {
      console.log(chalk.red("创建js文件失败..." + JSON.stringify(err)))
    }
  })
}

function createHTML(fileName, htmlTitle) {
  const data = readFileSync(buildPath("./tmp.html"), "utf-8")
  const HTML = new JSDOM(data)
  HTML.window.document.title = htmlTitle
  HTML.window.document.body.className = fileName
  const htmlData = HTML.serialize()
  console.log(htmlData)
  writeFile(buildPath("../src/htmls/" + fileName + ".html"), htmlData, err => {
    if (!err) {
      console.log(chalk.green("创建HTML文件成功..."))
    } else {
      console.log(chalk.red("创建HTML文件失败..." + JSON.stringify(err)))
    }
  })
}
