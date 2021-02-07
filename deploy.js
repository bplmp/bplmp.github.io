const ghpages = require("gh-pages")

const DIST_FOLDER = "_site"
const BRANCH_NAME = "master"

console.log(`---> deploying from folder: ${DIST_FOLDER} to branch: ${BRANCH_NAME}`)

ghpages.publish(DIST_FOLDER, {
  branch: BRANCH_NAME
}, function(err) {
  if (err) {
    console.log(`---> error: ${err}`)
  } else {
    console.log("---> all done.")
  }
})
