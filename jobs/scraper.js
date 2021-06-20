const axios = require('axios')
const cheerio = require('cheerio')
const dotenv = require('dotenv')
const Program = require('../models/AssistanceProgram')
const connectDB = require('../config/db')

dotenv.config({ path: './config/config.env' })

//Constants
const FOUNDATION_URL = 'https://www.healthwellfoundation.org/disease-funds/'
const PROGRAM_LIST = [
    'https://www.healthwellfoundation.org/fund/acromegaly/',
    'https://www.healthwellfoundation.org/fund/acute-myeloid-leukemia-medicare-access/',
    'https://www.healthwellfoundation.org/fund/adrenal-insufficiency/',
    'https://www.healthwellfoundation.org/fund/amyloidosis/',
    'https://www.healthwellfoundation.org/fund/amyotrophic-lateral-sclerosis/',
]

fetchData()

//The method updates the assistance programs
async function fetchData() {
    try {
        const conn = await connectDB()
        console.log('Crawling data...')

        const promises = []
        //Iterate over the programs url and scarp for the data
        PROGRAM_LIST.forEach((url) => {
            const programData = getProgramData(url)
            if (programData !== null) {
                promises.push(programData)
            }
        })

        const updatedPrograms = await Promise.all(promises)

        //Updates the program in the db
        await updatePrograms(updatedPrograms)

        console.log('Data updated')
        conn.disconnect()
        console.log('DB disconnect')
    } catch (err) {
        console.error(err)
    }
}

//The method received list of programs and to update in the db
async function updatePrograms(updatedPrograms) {
    try {
        const promises = []
        updatedPrograms.forEach((updatedProgram) => {
            //duplicate the object without to id so it can be updated
            let duplicateProgram = Object.assign({}, updatedProgram)._doc
            delete duplicateProgram._id

            promises.push(
                Program.findOneAndUpdate(
                    { name: updatedProgram.name },
                    duplicateProgram
                )
            )
        })
        await Promise.all(promises)

        return promises
    } catch (err) {
        console.error(err)
    }
}

//The method receive url and return Program object
async function getProgramData(programUrl) {
    try {
        const response = await axios(programUrl)
        if (response.status !== 200) {
            console.log('Error occurred while fetching program data')
            return null
        }
        const html = response.data
        const $ = cheerio.load(html)
        const programName = getName($)
        const status = getStatus($)
        const grantAmount = getAmount($)
        const treatments = getTreatments($)

        const program = new Program({
            name: programName,
            eligible_treatments: treatments,
            status: status,
            grant_amount: grantAmount,
        })

        return program
    } catch (err) {
        console.error(err)
        return null
    }
}

//The method returns the name of the program
function getName($) {
    const programName = $('#fund-intro > div > div > h1').text().trim()
    return programName
}

//The method returns the eligible treatments of the program
function getTreatments($) {
    const treatments = []
    $('#fund-details > div.treatments-covered > div > div > div > ul li').each(
        (i, el) => {
            treatments.push($(el).text())
        }
    )
    return treatments
}

//The method returns the status of the program
function getStatus($) {
    const statusDiv = $(
        '#fund-details > div.details > div:nth-child(1) > div:nth-child(1)'
    )
    const status = statusDiv[0].children[2].data.trim()
    const grantAmountDiv = $(
        '#fund-details > div.details > div:nth-child(2) > div:nth-child(1)'
    )
    return status
}

//The method returns the grant amount of the program
function getAmount($) {
    const grantAmountDiv = $(
        '#fund-details > div.details > div:nth-child(2) > div:nth-child(1)'
    )
    const grantAmount = grantAmountDiv[0].children[2].data.trim()
    return grantAmount
}

//The method used for first insertion of the data
async function getsPrograms(res) {
    try {
        const programsUrls = []
        const html = res.data
        const $ = cheerio.load(html)
        $(
            '#main > section.section.gutter.white > div > div > ul.funds li a'
        ).each((i, el) => {
            programsUrls.push($(el).attr('href'))
        })

        return programsUrls
    } catch (err) {
        console.error(err)
        return programsList
    }
}
