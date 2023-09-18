/**
 * Data Holder is a set out of function which help to keep api content hot
 * @author Timur Stegmann
 */


let DataHolder={}
let DHUpdated = false;

/**
 * Initialize a Data Holder element (simplified data fetch/ interval/ keepHot method )
 * @param id                Id of new element
 * @param rate              Refresh rate of element
 * @param endpoint          Fetch endpoint configuration
 * @param method            Fetch method configuration
 * @param body              Fetch body configuration
 * @returns {Promise<*>}    return data or failure
 */
function initDH(id, rate, endpoint, method, body) {
    if (isset(DataHolder[id])) return fetchDH(id)
    if (!isset(DataHolder[id])) DataHolder[id] = {}

    DataHolder[id]["config"] = {
        rate: rate,
        endpoint: endpoint,
        method: method,
        body: body
    }
    return fetchDH(id)
}

/**
 * loops through DataHolder and checks expired refresh rates to fetch
 */
setInterval(rateCallDH, 1000)
async function rateCallDH() {
    for (let dhKey in DataHolder) {
        let nextCallTime = new Date(DataHolder[dhKey].config.rate + DataHolder[dhKey].date).getTime(),
            time = new Date().getTime()

        if (time > nextCallTime) {
            let oldData = DataHolder[dhKey].data;
            await fetchDH(dhKey)
                .then(value => {
                    if (JSON.stringify(value.data).toString() !== JSON.stringify(oldData).toString() || oldData === [])
                        DHUpdated = true
                })
        }
    }
    return DHUpdated
}

/**
 * Fetches configured endpoints of id and fills data
 * @param id                    Id of DataHolder
 * @returns {Promise<unknown>}  Result of fetch or rejected
 */
function fetchDH(id) {
    return new Promise((resolve, reject) => {
        api(DataHolder[id].config.endpoint, DataHolder[id].config.method, DataHolder[id].config.body)
            .then((value) => {
                DataHolder[id].data = value.data
                DataHolder[id].date = new Date().getTime()

                resolve(value);
            })
            .catch((error) => reject(error))
    })
}

/**
 * Returns data property of DataHolder element
 * @param id        Id to look up
 * @returns {*}     data
 */
function getDH(id) { if (!isset(DataHolder[id]) || DataHolder[id].data === undefined) return []; return DataHolder[id].data }

/**
 * Works as a configurator of special data renewal events
 * @param id        Id to modify
 * @param data      Data to overwrite
 * @returns {*}     data
 */
function modifyDataDH(id, data) { DataHolder[id].data = data; DataHolder[id].date = new Date().getTime(); DHUpdated = true; return data; }

/**
 * Removes id from DataHolder construct and stops fetching
 * @param id            Id of element
 */
function closeDH(id) {delete DataHolder[id] }